import { renderNumber, renderPercentage } from "../../../common/utils/numbers";
import config from "../../../common/config";

describe("Vault details", () => {
  before(() => {
    cy.intercept("/api/v1/jones/prices", { fixture: "prices.json" });
    cy.intercept("/api/v1/jones/vaults/general", { fixture: "vaults-general.json" });
    cy.intercept("/api/v1/jones/farms/general", { fixture: "farms-general.json" });
    cy.visit("vaults/ETH");
  });

  context("Vault closed", () => {
    beforeEach(() => {
      cy.intercept(
        "/api/v1/allowance/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1?ownerAddress=0x8888888888888888888888888888888888888888&spenderAddress=0xF46Ce0C13577232D5F29D9Bd78a9Cab278755346",
        { fixture: "allowance.json" },
      );
      cy.intercept(
        "/api/v1/allowance/0x662d0f9Ff837A51cF89A1FE7E0882a906dAC08a3?ownerAddress=0x8888888888888888888888888888888888888888&spenderAddress=0xF46Ce0C13577232D5F29D9Bd78a9Cab278755346",
        { fixture: "allowance.json" },
      );
      cy.intercept(
        "/api/v1/balance/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1?address=0x8888888888888888888888888888888888888888",
        { fixture: "balance.json" },
      );
      cy.intercept(
        "/api/v1/balance/0x662d0f9Ff837A51cF89A1FE7E0882a906dAC08a3?address=0x8888888888888888888888888888888888888888",
        { fixture: "balance.json" },
      );
      cy.intercept("/api/v1/jones/vaults/personal/0x8888888888888888888888888888888888888888", {
        fixture: "vaults-personal.json",
      });
    });
    it("shows vault name in page title", () => {
      cy.getBySel("page-title-token").find("h2").should("contain", "ETH Vault");
    });

    it("shows the vault status", () => {
      cy.getBySel("vault-status")
        .should("contain", "Vault status")
        .should("contain", "Deposits and Claims are closed")
        .should("contain", "Auto-rolling")
        .should("contain", "Vault is closed");
    });

    it("shows the vault details", () => {
      cy.fixture("vaults-general").then(({ vaults }) => {
        cy.getBySel("vault-details")
          .children()
          .should(($detailSection) => {
            const [ethVault] = vaults;
            expect($detailSection.eq(0)).to.contain(`About ${ethVault.vaultName} Vault`);
            expect($detailSection.eq(1)).to.contain("Avg. historical yield");
            expect($detailSection.eq(1)).to.contain("APY");
            expect($detailSection.eq(2)).to.contain(
              "Generates ETH yield with an actively managed and hedged options strategy. Vault and strategy parameters are under the supervision of the DAO strategy team.",
            );
            expect($detailSection.eq(3)).to.contain("Vault filled");
            expect($detailSection.eq(3)).to.contain(renderPercentage(ethVault.vaultPercentage));
            expect($detailSection.eq(3)).to.contain(renderNumber(ethVault.totalDeposited, 2));
            expect($detailSection.eq(3)).to.contain(renderNumber(ethVault.vaultCap));
          });
      });
    });

    it("shows vault claimable balance when wallet is connected", () => {
      cy.getBySel("connect-wallet").click();
      cy.getBySel("terms-popup-body").scrollTo("bottom");
      cy.getBySel("accept-terms-button").click();
      cy.fixture("vaults-general").then(({ vaults }) => {
        cy.getBySel("vault-details")
          .children()
          .should(($detailSection) => {
            const [ethVault] = vaults;
            expect($detailSection).to.contain("My Vault");
            expect($detailSection).to.contain("Claimable balance");
            expect($detailSection).to.contain(ethVault.vaultName);
          });
      });
      cy.getBySel("connect-wallet").click();
    });

    it("shows the vault interaction panel", () => {
      cy.fixture("vaults-general").then(({ vaults }) => {
        const [ethVault] = vaults;
        cy.getBySel("vault-interaction")
          .children()
          .within(($section) => {
            expect($section).to.have.length(4);

            expect($section.eq(0)).to.contain("Deposit");
            expect($section.eq(0)).to.contain("Claim");
            expect($section.eq(1)).to.contain("Balance");
            expect($section.eq(1)).to.contain("Max");
            expect($section.eq(2)).to.contain("Vault is closed");
            expect($section.eq(3)).to.contain("You will get");
            expect($section.eq(3)).to.contain("jETH");

            cy.contains("Vault is closed").should("be.disabled");

            cy.get("input").clear().type("1");
            cy.contains(renderNumber(ethVault.jAssetPerToken, 6));

            cy.contains("Claim").click();

            cy.get("input").clear().type("1");
            expect($section.eq(3)).to.contain("ETH");
            cy.contains(renderNumber(ethVault.tokenPerJAsset, 6));
          });
      });
    });

    it("shows the farms section", () => {
      cy.getBySel("vault-staking-section")
        .should("contain", "What's next?")
        .and(
          "contain",
          "Stake your jETH in one of the LP staking pools to earn additional yield in $JONES tokens.",
        )
        .and("contain", "Combined yield APY")
        .and(
          "contain",
          "Our Combined Yield strategy (or the jOnion as we have dubbed it - yield with many layers) exists to offset risk for Jones Vault users. By depositing 50% of your tokens into the vault and making an LP pair with the other 50%, you can maximize yield rewards and earn that sweet $JONES token.",
        )
        .find("button")
        .should("contain", "Add $jETH to Metamask");

      cy.getBySel("vault-apy-card")
        .first()
        .within((card) => {
          expect(card).to.contain("Avg. Historical yield APY");
          expect(card).to.contain("ETH");
        });

      cy.getBySel("vault-apy-card")
        .last()
        .within((card) => {
          expect(card).to.contain("Combined yield APY");
          expect(card).to.contain("jETH-ETH");
          expect(card).to.contain("APR");
        });
    });

    it("shows the about section", () => {
      cy.getBySel("vault-product-info")
        .should("contain", "Product Info")
        .should("contain", "Auto-Rolling Deposits")
        .should("contain", "Deposits are open at the end of each epoch")
        .getBySel("product-info-btn")
        .eq(1)
        .click();
      cy.getBySel("vault-product-info").should(
        "contain",
        "Claims are available at the end of each epoch",
      );

      cy.get(
        'a[href="https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"]',
      );
      cy.get('a[href="https://arbiscan.io/address/0xF46Ce0C13577232D5F29D9Bd78a9Cab278755346"]');
    });
  });

  context("Vault open", () => {
    before(() => {
      cy.intercept("/api/v1/jones/prices", { fixture: "prices.json" });
      cy.intercept("/api/v1/jones/vaults/general", { fixture: "vaults-general.json" });
      cy.intercept("/api/v1/jones/farms/general", { fixture: "farms-general.json" });
      cy.visit("vaults/gOHM");
    });

    it("shows the vault status", () => {
      cy.getBySel("vault-status")
        .should("contain", "Vault status")
        .should("contain", "Deposits and Claims are open")
        .should("contain", "Auto-rolling")
        .should("contain", "Vault is open");
    });

    it("shows the vault interaction panel", () => {
      cy.getBySel("vault-interaction")
        .children()
        .within(($section) => {
          expect($section).to.have.length(4);

          expect($section.eq(0)).to.contain("Deposit");
          expect($section.eq(0)).to.contain("Claim");
          expect($section.eq(1)).to.contain("Balance");
          expect($section.eq(1)).to.contain("Max");
          expect($section.eq(2)).to.contain("Connect wallet");
          expect($section.eq(3)).to.contain("You will get");
          expect($section.eq(3)).to.contain("jgOHM");

          cy.contains("Connect wallet").should("not.be.disabled");
          cy.contains("Claim").click();

          expect($section.eq(3)).to.contain("gOHM");
        });
    });
  });

  context("Test Analytics for ETH Vault", () => {
    before(() => {
      cy.intercept("/api/v1/jones/prices", { fixture: "prices.json" });
      cy.intercept("/api/v1/jones/vaults/general", { fixture: "vaults-general.json" });
      cy.intercept("/api/v1/jones/farms/general", { fixture: "farms-general.json" });
      cy.visit("vaults/ETH");
    });

    const ETHvaultData = config.vaultData["ETH"].roi;

    it("checks analytics tab", () => {
      cy.getBySel("vault-analytics-tab")
        .first()
        .should("contain", "Vault")
        .should("contain", "Analytics");
      cy.getBySel("analytics-btn").first().click();
    });

    it("check chart for monthly performance", () => {
      cy.getBySel("performance-chart")
        .first()
        .should("contain", "Monthly Return")
        .should("contain", "Singular month vault ROI")
        .within(() => {
          cy.get(".recharts-xAxis").within(() => {
            cy.get(".recharts-cartesian-axis-tick").should(
              "have.length",
              Object.keys(ETHvaultData).length,
            );
          });
        });
    });
  });
});
