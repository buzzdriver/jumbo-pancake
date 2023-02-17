import { renderUsd } from "../../../common/utils/numbers";
import { FarmStatic, FarmGeneral } from "@jones-dao/sdk";
type FarmType = FarmStatic & FarmGeneral;

describe("General Farms", () => {
  before(() => {
    cy.intercept("/api/v1/jones/prices", { fixture: "prices.json" });
    cy.intercept("/api/v1/jones/farms/general", { fixture: "farms-general.json" });
    cy.visit("staking");
  });

  context("Overall Layout", () => {
    it("shows the title", () => {
      cy.getBySel("page-title").within(() => {
        cy.get("h2").should("contain", "Staking");
      });
    });

    it("shows the tvl", () => {
      cy.fixture("farms-general").then(({ farms }) => {
        const totalFarmstvl = farms.reduce((acc: number, curr: FarmType) => {
          return acc + curr.totalStakedValue + curr.deprecatedFarmTotalStakedValue;
        }, 0);
        cy.getBySel("tvl")
          .should("contain", renderUsd(totalFarmstvl, 0))
          .should("contain", "Total Value Locked");
      });
    });

    it("checks headers of the staking pool", () => {
      cy.getBySel("staking-pool-header").within(() => {
        cy.get("p")
          .should("contain", "APR")
          .should("contain", "TVL")
          .should("contain", "CLAIMABLE");
      });

      cy.getBySel("staking-pool-tooltip").trigger("mouseover");
      cy.getBySel("tooltip")
        .should("contain", "Staking APR is the annual yield, expressed in percentages.")
        .should(
          "contain",
          "The APR shown is based on the projected data, assuming the options will expire out of the money and the collateral will be fully utilized.",
        )
        .should(
          "contain",
          "The indicative APR is not guaranteed as is subject to market risk. The strategies are not risk-free, and some epochs may result in a negative return.",
        );
    });

    it("checks the number of staking pools", () => {
      cy.getBySel("staking-pool").should("have.length", 6);
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
});

describe("Expanded Farms", () => {
  context("Checks the Jones Staking Pool", () => {
    before(() => {
      cy.intercept("/api/v1/jones/prices", { fixture: "prices.json" });
      cy.intercept("/api/v1/jones/farms/general", { fixture: "farms-general.json" });
      cy.visit("staking");
      cy.getBySel("staking-pool").first().as("jonesPool");
    });

    it("checks Jones pool information", () => {
      cy.get("@jonesPool")
        .click()
        .should("contain", "12.57%")
        .should("contain", "1,504,737.19")
        .should("contain", "Your stake");
      cy.get("@jonesPool")
        .click()
        .find("a")
        .invoke("attr", "href")
        .should(
          "equal",
          "https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x10393c20975cF177a3513071bC110f7962CD67da",
        );
    });
  });
});
