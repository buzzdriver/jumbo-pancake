export const validateRow = (row: JQuery<HTMLElement>, data: string[]) =>
  data.map((value, index) => expect(row.eq(index)).to.contain(value));
