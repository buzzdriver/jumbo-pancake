describe("Single Farm", () => {
  before(() => {
    cy.intercept("/api/v1/jones/prices", { fixture: "prices.json" });
    cy.intercept("/api/v1/jones/farms/general", { fixture: "farms-general.json" });
    cy.intercept("/api/v1/jones/farms/personal/0x8888888888888888888888888888888888888888", {
      fixture: "farms-personal.json",
    });
    cy.intercept("/api/v1/jones/farms/deprecated/0x8888888888888888888888888888888888888888", {
      fixture: "farms-deprecated.json",
    });

    cy.visit("staking");
    cy.getBySel("connect-wallet").click();
    cy.getBySel("terms-popup-body").scrollTo("bottom");
    cy.getBySel("accept-terms-button").click();
  });

  describe("Test single Jones farm when connected", () => {
    beforeEach(() => {
      cy.intercept(
        "/api/v1/balance/0x10393c20975cF177a3513071bC110f7962CD67da?address=0x8888888888888888888888888888888888888888",
        { fixture: "farms-balance.json" },
      );
      cy.intercept(
        "api/v1/allowance/0x10393c20975cF177a3513071bC110f7962CD67da?ownerAddress=0x8888888888888888888888888888888888888888&spenderAddress=0xb94d1959084081c5a11C460012Ab522F5a0FD756",
        { fixture: "farms-allowance.json" },
      );

      cy.getBySel("staking-pool").first().as("jonesPool");
      cy.get("@jonesPool").click();
    });

    it("checks the deprecated pool", () => {
      cy.getBySel("deprecated-pool")
        .should("contain", "Deprecated")
        .should("contain", "Claim and Unstake")
        .should("contain", "10")
        .should("contain", "20")
        .should("contain", "200")
        .should("contain", "200");
    });

    it("checks Jones pool personal information", () => {
      cy.get("@jonesPool")
        .should("contain", "Your stake")
        .should("contain", "JONES")
        .should("contain", "Stake")
        .should("contain", "Claim")
        .should("contain", "Unstake")
        .should("contain", "Compound")
        .should("contain", "100")
        .should("contain", "200")
        .should("contain", "10")
        .should("contain", "20")
        .should("contain", "Claim")
        .should("not.be.disabled")
        .should("contain", "Compound")
        .should("not.be.disabled");
    });

    it("checks the staking modal", () => {
      cy.get("@jonesPool").getBySel("Stake-btn").eq(1).click();
      cy.getBySel("farm-interaction-modal")
        .should("contain", "Stake")
        .should("contain", "You will stake")
        .should("contain", "Current APR")
        .should("contain", "12.57%")
        .should("contain", "Balance")
        .should("contain", "Enter JONES amount")
        .should("contain", "Max");

      cy.getBySel("farm-interaction-modal")
        .find("a")
        .first()
        .invoke("attr", "href")
        .should(
          "equal",
          "https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x10393c20975cF177a3513071bC110f7962CD67da",
        );

      cy.getBySel("farm-interaction-modal")
        .find("a")
        .last()
        .invoke("attr", "href")
        .should("equal", "https://docs.jonesdao.io/jones-dao/");

      cy.getBySel("farm-interaction-close").click();
    });

    it("checks the unstaking modal", () => {
      cy.get("@jonesPool").getBySel("Unstake-btn").eq(1).click();
      cy.getBySel("farm-interaction-modal")
        .should("contain", "Unstake")
        .should("contain", "You will unstake")
        .should("contain", "Current APR")
        .should("contain", "12.57%")
        .should("contain", "Balance")
        .should("contain", "Enter JONES amount")
        .should("contain", "Max");

      cy.getBySel("farm-interaction-modal")
        .find("a")
        .first()
        .invoke("attr", "href")
        .should(
          "equal",
          "https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x10393c20975cF177a3513071bC110f7962CD67da",
        );

      cy.getBySel("farm-interaction-modal")
        .find("a")
        .last()
        .invoke("attr", "href")
        .should("equal", "https://docs.jonesdao.io/jones-dao/");
    });
  });
});

export {};
