export {};

describe("General UI breakpoints visibility test", () => {
  before(() => {
    cy.intercept("/api/v1/jones/prices", { fixture: "prices.json" });
    cy.intercept("/api/v1/jones/vaults/general", { fixture: "vaults-general.json" });
    cy.visit("vaults/");
  });

  context("Desktop and mobile nav", () => {
    it("shows jones logo, navigation items, jones menu, full arbitrum logo and connect button on desktop view", () => {
      cy.getBySel("mobile-hamburger-menu").should("not.be.visible");
      cy.getBySel("nav-jones-hat").should("be.visible");
      cy.getBySel("nav-navigation-items").contains("Vaults");
      cy.getBySel("nav-navigation-items").contains("Staking");
      cy.getBySel("nav-navigation-items").contains("Community");
      cy.getBySel("nav-jones-menu").should("be.visible");
      cy.getBySel("arbitrum-icon").should("be.visible");
      cy.getBySel("connect-wallet").should("be.visible");
    });
    it("shows hamburger menu, jones logo, mobile arbitrum logo and connect button on mobile view", () => {
      cy.viewport(375, 812);
      cy.getBySel("mobile-hamburger-menu").should("be.visible");
      cy.getBySel("nav-jones-hat").should("be.visible");
      cy.getBySel("nav-navigation-items").should("not.be.visible");
      cy.getBySel("nav-jones-menu").should("not.be.visible");
      cy.getBySel("mobile-arbitrum-icon").should("be.visible");
      cy.getBySel("connect-wallet").should("be.visible");
    });
  });
  context("Footer", () => {
    it("shows all footer links and terms toggle on desktop view", () => {
      cy.getBySel("footer").should("be.visible");
      cy.getBySel("footer")
        .children()
        .should(($footerLink) => {
          expect($footerLink.eq(0)).to.contain("Gitbook");
          expect($footerLink.eq(0)).to.contain("Discord");
          expect($footerLink.eq(0)).to.contain("Twitter");
          expect($footerLink.eq(0)).to.contain("Forum");
          expect($footerLink.eq(0)).to.contain("Blog");
        });
      cy.getBySel("footer-terms").should("be.visible");
    });
    it("shows all footer links and terms toggle on mobile view", () => {
      cy.viewport(375, 812);
      cy.getBySel("footer").should("be.visible");
      cy.getBySel("footer")
        .children()
        .should(($footerLink) => {
          expect($footerLink.eq(0)).to.contain("Gitbook");
          expect($footerLink.eq(0)).to.contain("Discord");
          expect($footerLink.eq(0)).to.contain("Twitter");
          expect($footerLink.eq(0)).to.contain("Forum");
          expect($footerLink.eq(0)).to.contain("Blog");
        });
      cy.getBySel("footer-terms").should("be.visible");
    });
  });
});
