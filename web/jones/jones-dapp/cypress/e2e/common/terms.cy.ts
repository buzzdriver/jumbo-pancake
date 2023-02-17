export {};

describe("Terms pop-up", () => {
  before(() => {
    cy.intercept("/api/v1/jones/prices", { fixture: "prices.json" });
    cy.intercept("/api/v1/jones/vaults/general", { fixture: "vaults-general.json" });
    cy.visit("vaults/");
  });

  context("Wallet disconnected", () => {
    it("shows the Vault page directly", () => {
      cy.getBySel("page-title").within(() => {
        cy.get("h2").should("contain", "Vaults");
        cy.get("p").should(
          "contain",
          "Generate yield with an actively managed and hedged options spread",
        );
      });
    });
  });

  context("Wallet connected", () => {
    it("shows popup and only allows closure when scrolled to bottom", () => {
      cy.getBySel("connect-wallet").click();
      cy.getBySel("terms-conditions-modal").should("contain", "Terms of Service");
      cy.getBySel("accept-terms-button").should("be.disabled");
      cy.getBySel("terms-popup-body").scrollTo("bottom");
      cy.getBySel("accept-terms-button").click();
      cy.getBySel("page-title").within(() => {
        cy.get("h2").should("contain", "Vaults");
        cy.get("p").should(
          "contain",
          "Generate yield with an actively managed and hedged options spread",
        );
      });
    });
  });
});
