import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import {Stage, Layer, Rect, Text, Line} from 'react-konva';
import {useCallback, useEffect} from "react";
import {useResizeDetector} from "react-resize-detector";

interface BarGraph {
  name: string;
  positive: number;
  negative: number;
  color: string;
}

export const Summary = () => {
  const rules: Rule[] = useLiveQuery(() => db.rules.toArray()) || [];
  const categories: Category[] = useLiveQuery(() => db.categories.toArray()) || [];
  const transactions = useLiveQuery(() => db.transactions.orderBy('date').toArray()) || [];
  const { width, height, ref } = useResizeDetector();

  const [barGraphData, maxVal, minVal] = useCallback(() => {
    const data = categories.map((c): BarGraph => {
      const categoryRulesRegex = rules.filter(r => r.categoryId === c.id).map(r => new RegExp(r.regex, 'g'));
      const matchingTransactions = transactions.filter(t => categoryRulesRegex.some(r => t.description?.match(r)) || t.categoryId === c.id);
      const positive = matchingTransactions.filter(t => t.amount > 0).reduce((prev, curr) => prev + curr.amount, 0);
      const negative = matchingTransactions.filter(t => t.amount < 0).reduce((prev, curr) => prev + curr.amount, 0);
      return {
        name: c.name,
        positive,
        negative,
        color: c.color
      }
    });

    const max = data.reduce((prev, curr) => Math.max(prev, curr.positive), 0);
    const min = data.reduce((prev, curr) => -Math.max(-prev, -(curr.positive + curr.negative)), 0);
    return [data, max, min] as [BarGraph[], number, number];
  }, [transactions, rules, categories])();

  const barPadding = 20;
  const barHeight = 200;
  const barGraphWidth = 50;

  const toProportion = useCallback((dollars: number) => (maxVal - dollars) / (maxVal - minVal), [maxVal, minVal]);
  const toPixels = useCallback((dollars: number) => (toProportion(dollars) * barHeight) + barPadding, [maxVal, minVal]);

  const CategoryBarGraph = ({data, barHeight, barWidth, x, y}:CategoryBarGraphProps) => {
    return (
      <>
        <Rect x={x} y={y + toPixels(data.positive)} height={toPixels(0) - toPixels(data.positive)} width={barWidth/2} fill={'#25a225'}/>
        <Rect x={x + barWidth/2} y={y + toPixels(data.positive + data.negative)} height={toPixels(0) - toPixels(data.negative)} width={barWidth/2} fill={'#bd2727'}/>
        <Text text={data.name} x={x - barWidth/2} y={y + barHeight + 5} width={barWidth*2} align={'center'}/>
      </>
    );
  };

  return (<div className={"content-container"}>
    <div ref={ref} className={"w-full"} style={{height: barHeight + 2*barPadding}}>
      <Stage width={width} height={height}>
        <Layer x={barPadding} y={barPadding}>
          <Line points={[0, toPixels(0), (width || 0)-2*barPadding, toPixels(0)]} stroke={'#989898'} strokeWidth={0.5}/>
        </Layer>
        <Layer>
          {barGraphData.map((b, idx) => <CategoryBarGraph
            key={idx}
            x={idx * (((width || 0) - 2*barPadding - barGraphWidth)/(barGraphData.length-1)) + barPadding} y={barPadding}
            barWidth={barGraphWidth} barHeight={barHeight}
            data={b} />)}
        </Layer>
      </Stage>
    </div>
  </div>)
};

interface CategoryBarGraphProps {
  data: BarGraph;
  barWidth: number;
  barHeight: number;
  x: number;
  y: number;
}
