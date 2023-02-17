import React from "react";

import { Card } from "../common/components/Card";
import Layout from "../common/components/Layout";
import TermsText from "../common/components/Layout/TermsText";
import { PageTitle } from "../common/components/PageTitle";

const Terms = () => (
  <Layout title="Terms of Service">
    <PageTitle title="Terms of Service" />
    <Card>
      <TermsText p={12} mt={12} />
    </Card>
  </Layout>
);

export default Terms;
