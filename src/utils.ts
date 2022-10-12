export const transformKiwibank = (inData: any[]): Transaction[] => {
  return inData.map(d => ({
    amount: Number.parseFloat(d["Amount"]),
    description: d["Memo/Description"],
    date: d["Date"] && new Date(...d["Date"].split('-').reverse()),
    balance: Number.parseFloat(d["Balance"]),
    inParticulars: [d["TP ref"], d["TP part"], d["TP code"]].join(' '),
    outParticulars: [d["OP ref"], d["OP part"], d["OP code"]].join(' ')
  }))
}

export const filterData = (data: Transaction[], re?: RegExp) => data.filter(d => !re || !d.description?.match(re))

export const genRandomColour = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}