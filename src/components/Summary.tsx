import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import {useCallback, useContext} from "react";
import {AppContext} from "../contexts/AppContext";
import {Step} from "../App";

export const Summary = () => {
  const rules: Rule[] = useLiveQuery(() => db.rules.toArray()) || [];
  const categories: Category[] = useLiveQuery(() => db.categories.toArray()) || [];
  const transactions = useLiveQuery(() => db.transactions.orderBy('date').toArray()) || [];

  const { setCategoryId, setStep } = useContext(AppContext);

  const totalPositive = useCallback(() =>
    transactions
      .filter(t => t.amount > 0)
      .reduce((prev, curr) => prev + curr.amount, 0),
    [transactions])();

  const totalNegative = useCallback(() =>
    transactions
      .filter(t => t.amount < 0)
      .reduce((prev, curr) => prev + curr.amount, 0),
    [transactions])();

  const data = useCallback(() => {
    const d = categories.map((c) => {
      const categoryRulesRegex = rules.filter(r => r.categoryId === c.id).map(r => new RegExp(r.regex, 'g'));
      const matchingTransactions = transactions.filter(t => categoryRulesRegex.some(r => t.description?.match(r)) || t.categoryId === c.id);
      const positive = matchingTransactions.filter(t => t.amount > 0).reduce((prev, curr) => prev + curr.amount, 0);
      const negative = matchingTransactions.filter(t => t.amount < 0).reduce((prev, curr) => prev + curr.amount, 0);
      return {
        id: c.id,
        name: c.name,
        positive,
        negative,
        proportionPositive: positive/totalPositive,
        proportionNegative: negative/totalNegative,
        net: positive + negative,
        proportionNet: (positive + negative)/(totalPositive + totalNegative),
        color: c.color
      }
    });

    const unreconciledTransactions = transactions.filter(t => t.categoryId === undefined && rules.every(r => !t.description?.match(new RegExp(r.regex, 'g'))));
    if (unreconciledTransactions.length) {
      const positive = unreconciledTransactions.filter(t => t.amount > 0).reduce((prev, curr) => prev + curr.amount, 0);
      const negative = unreconciledTransactions.filter(t => t.amount < 0).reduce((prev, curr) => prev + curr.amount, 0);
      d.push({
        id: undefined,
        name: "Unreconciled",
        positive,
        negative,
        proportionPositive: positive / totalPositive,
        proportionNegative: negative / totalNegative,
        net: positive + negative,
        proportionNet: (positive + negative) / (totalPositive + totalNegative),
        color: '#fff'
      });
    }

    return d;
  }, [transactions, rules, categories])();

  return (
    <fieldset className={"content-container"}>
      <legend>Summary</legend>
    <div className={"block max-h-96 overflow-y-scroll"}>
    <table className={"persian-table w-full border-2 border-middleBlue"} cellPadding={4}>
      <thead className={"bg-persian text-snow h-8"}>
      <tr className={"text-left"}>
        <th>Category</th>
        <th className={"text-right"}>In</th>
        <th className={"text-right"}>In Proportion</th>
        <th className={"text-right"}>Out</th>
        <th className={"text-right"}>Out Proportion</th>
        <th className={"text-right"}>Net</th>
        <th className={"text-right"}>Net Proportion</th>
      </tr>
    </thead>
      <tbody>
      {data.map((d, idx) => {
        const color = d.color + '88';
        return (<tr key={idx}
                    className={(color ? "" : "odd:bg-slate-50 even:bg-white") + (d.id ? "hover:cursor-pointer" : "")}
                    onClick={() => {if (d.id) {setCategoryId(d.id); setStep(Step.ALL)}}}
                    style={{backgroundColor: color}}>
          <td>{d.name}</td>
          <td className={"text-right"}>{d.positive.toFixed(2)}</td>
          <td className={"text-right"}>{(d.proportionPositive * 100).toFixed(2)}%</td>
          <td className={"text-right"}>{d.negative.toFixed(2)}</td>
          <td className={"text-right"}>{(d.proportionNegative * 100).toFixed(2)}%</td>
          <td className={"text-right"}>{d.net.toFixed(2)}</td>
          <td className={"text-right"}>{(d.proportionNet * 100).toFixed(2)}%</td>
        </tr>)
      })}
      </tbody>

      <tfoot className={"border-slate-500"}>
        <tr>
          <td className={""}><strong>Total</strong></td>
          <td className={"text-right"}>{totalPositive.toFixed(2)}</td>
          <td className={""}></td>
          <td className={"text-right"}>{totalNegative.toFixed(2)}</td>
          <td className={""}></td>
          <td className={"text-right"}>{(totalPositive + totalNegative).toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
    </div>
    </fieldset>
  );
}

// import {Stage, Layer, Rect, Text, Line} from 'react-konva';
// import {useResizeDetector} from "react-resize-detector";
// interface BarGraph {
//   name: string;
//   positive: number;
//   negative: number;
//   color: string;
// }

// export const BarGraphSummary = () => {
//   const rules: Rule[] = useLiveQuery(() => db.rules.toArray()) || [];
//   const categories: Category[] = useLiveQuery(() => db.categories.toArray()) || [];
//   const transactions = useLiveQuery(() => db.transactions.orderBy('date').toArray()) || [];
//   const { width, height, ref } = useResizeDetector();
//
//   const [barGraphData, maxVal, minVal] = useCallback(() => {
//     const data = categories.map((c): BarGraph => {
//       const categoryRulesRegex = rules.filter(r => r.categoryId === c.id).map(r => new RegExp(r.regex, 'g'));
//       const matchingTransactions = transactions.filter(t => categoryRulesRegex.some(r => t.description?.match(r)) || t.categoryId === c.id);
//       const positive = matchingTransactions.filter(t => t.amount > 0).reduce((prev, curr) => prev + curr.amount, 0);
//       const negative = matchingTransactions.filter(t => t.amount < 0).reduce((prev, curr) => prev + curr.amount, 0);
//       return {
//         name: c.name,
//         positive,
//         negative,
//         color: c.color
//       }
//     });
//
//     const max = data.reduce((prev, curr) => Math.max(prev, curr.positive), 0);
//     const min = data.reduce((prev, curr) => -Math.max(-prev, -(curr.positive + curr.negative)), 0);
//     return [data, max, min] as [BarGraph[], number, number];
//   }, [transactions, rules, categories])();
//
//   const barPadding = 20;
//   const barHeight = 200;
//   const barGraphWidth = 50;
//
//   const toProportion = useCallback((dollars: number) => (maxVal - dollars) / (maxVal - minVal), [maxVal, minVal]);
//   const toPixels = useCallback((dollars: number) => (toProportion(dollars) * barHeight) + barPadding, [maxVal, minVal]);
//
//   const CategoryBarGraph = ({data, barHeight, barWidth, x, y}:CategoryBarGraphProps) => {
//     return (
//       <>
//         <Rect x={x} y={y + toPixels(data.positive)} height={toPixels(0) - toPixels(data.positive)} width={barWidth/2} fill={'#25a225'}/>
//         <Rect x={x + barWidth/2} y={y + toPixels(data.positive + data.negative)} height={toPixels(0) - toPixels(data.negative)} width={barWidth/2} fill={'#bd2727'}/>
//         <Text text={data.name} x={x - barWidth/2} y={y + barHeight + 5} width={barWidth*2} align={'center'}/>
//       </>
//     );
//   };
//
//   return (<div className={"content-container"}>
//     <div ref={ref} className={"w-full"} style={{height: barHeight + 2*barPadding}}>
//       <Stage width={width} height={height}>
//         <Layer x={barPadding} y={barPadding}>
//           <Line points={[0, toPixels(0), (width || 0)-2*barPadding, toPixels(0)]} stroke={'#989898'} strokeWidth={0.5}/>
//         </Layer>
//         <Layer>
//           {barGraphData.map((b, idx) => <CategoryBarGraph
//             key={idx}
//             x={idx * (((width || 0) - 2*barPadding - barGraphWidth)/(barGraphData.length-1)) + barPadding} y={barPadding}
//             barWidth={barGraphWidth} barHeight={barHeight}
//             data={b} />)}
//         </Layer>
//       </Stage>
//     </div>
//   </div>)
// };
//
// interface CategoryBarGraphProps {
//   data: BarGraph;
//   barWidth: number;
//   barHeight: number;
//   x: number;
//   y: number;
// }
