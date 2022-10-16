export const transformKiwibank = (inData: any[], fileId: number): Transaction[] => {
  const newData: Transaction[] = [];
  inData.forEach(d => {
    try {
      const dateSplit = d["Date"].split('-').reverse() as [number, number, number]; // year, month (1-indexed), day
      dateSplit[1] -= 1; // yes, this was a string, yes, it's now a number, do I care? no
      newData.push({
        amount: Number.parseFloat(d["Amount"]),
        description: d["Memo/Description"],
        date: d["Date"] && new Date(...dateSplit),
        balance: Number.parseFloat(d["Balance"]),
        inParticulars: [d["TP ref"], d["TP part"], d["TP code"]].join(' '),
        outParticulars: [d["OP ref"], d["OP part"], d["OP code"]].join(' '),
        fileId
      });
    } catch {
      return -1
    }
  });
  return newData;
}

export const filterData = (data: Transaction[], re?: RegExp) => data.filter(d => !re || !d.description?.match(re))

export const formatDate = (date: Date) => `${(date.getFullYear() % 100).toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getUTCDate() + 1).toString().padStart(2, '0')}`

export const genRandomColour = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}