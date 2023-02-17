import { validateRow } from "../../support/helpers";

export {};

describe("Vaults", () => {
  before(() => {
    cy.intercept("/api/v1/jones/prices", { fixture: "prices.json" });
    cy.intercept("/api/v1/jones/vaults/general", { fixture: "vaults-general.json" });
    cy.visit("vaults");
  });

  context("Layout", () => {
    it("shows the title", () => {
      cy.getBySel("page-title").within(() => {
        cy.get("h2").should("contain", "Vaults");
        cy.get("p").should(
          "contain",
          "Generate yield with an actively managed and hedged options spread",
        );
      });
    });

    it("shows the tvl", () => {
      cy.getBySel("tvl")
        .should("contain", "$3,040,913")
        .should("contain", "Total Value Locked")
        .should("contain", "Auto-rolling");
    });

    it("shows vault overview cards", () => {
      cy.getBySel("vault-overview-card").should("have.length", 4);
    });

    it("shows the info footer", () => {
      cy.getBySel("info-footer").within(() => {
        cy.getBySel("info-section")
          .should("have.length", 3)
          .each(($section) => {
            expect($section).to.contain("img");
            expect($section).to.contain("p");
          });

        cy.get("a").invoke("attr", "href").should("equal", "https://docs.jonesdao.io/jones-dao/");
      });
    });

    it("shows the disclaimer", () => {
      cy.getBySel("disclaimer")
        .should("contain", "Disclaimers")
        .should(
          "contain",
          "The indicative ROI/APY is not guaranteed and is subject to market risk. The strategies are not risk-free, and some epochs may result in a negative return. Details and management fees can be found in our docs.",
        );
    });
  });

  context("Vault overview card", () => {
    beforeEach(() => {
      cy.getBySel("vault-overview-card").first().as("ethVault");
    });

    it("shows the vault name", () => {
      cy.get("@ethVault").find("h2").should("contain", "ETH");
    });

    it("shows the apy", () => {
      cy.get("@ethVault")
        .should("contain", "%")
        .should("contain", "APY")
        .should("contain", "Avg. Historical Yield");
    });

    it("shows the vault percentage filled", () => {
      cy.get("@ethVault")
        .getBySel("progress-bar")
        .should("contain", "Vault filled")
        .should("contain", "70.41%")
        .parent()
        .should("contain", "1,408.30 / 2,000 ETH");
    });

    it("shows the live pnl", () => {
      cy.get("@ethVault").should("contain", "Epoch Live Position");
    });

    it("shows the vault tvl", () => {
      cy.get("@ethVault").should("contain", "TVL").should("contain", "$1,633,060.46");
    });

    it("shows the vault status badge", () => {
      cy.get("@ethVault").getBySel("vault-status-badge").should("contain", "Vault is closed");
    });
  });
  context("Vault overview graph", () => {
    it("shows the title", () => {
      cy.contains("Avg. Historical Yield");
    });

    it("shows the avg apy graph", () => {
      // graph is displayed
      cy.getBySel("vault-yield-graph").within(() => cy.get(".recharts-responsive-container"));

      // shows 4 lines, each represents a vault
      cy.get(".recharts-line").should("have.length", 4);
    });

    it("shows the filters", () => {
      cy.getBySel("vault-yield-graph").within(() => {
        cy.get(".chakra-stack")
          .first()
          .children()
          .within((filterButtons) =>
            validateRow(filterButtons, ["All", "1M", "3M", "6M", "1Y", "YTD"]),
          );
      });
    });

    it("shows the legend", () => {
      cy.getBySel("vault-yield-graph")
        .find("ul")
        .children()
        .should((legend) => {
          validateRow(legend, ["ETH", "gOHM", "DPX", "rDPX"]);
        });
    });

    it("filters the graph", () => {
      cy.contains("3M").click();
      cy.get(".recharts-line")
        .first()
        .within(() => {
          // filter on 3M should show 3 circle (dots) elements
          cy.get("circle").should("have.length", 3);
        });

      cy.contains("1M").click();
      cy.get(".recharts-line")
        .first()
        .within(() => {
          // filter on 1M should show 3 circle (dots) elements
          cy.get("circle").should("have.length", 1);
        });
    });
  });
});
