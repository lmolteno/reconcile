import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import {Stage, Layer, Rect, Text, Line} from 'react-konva';
import {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";

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
    return [data, max, min];
  }, [transactions, rules, categories])();

  console.log([barGraphData, maxVal, minVal])

  const canvasRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setHeight(canvasRef.current?.offsetHeight || 0)
    setWidth(canvasRef.current?.offsetWidth || 0)
  }, [canvasRef]);

  const barPadding = 20;
  const barHeight = 200;
  const barGraphWidth = 50;

  const toProportion = dollars => (maxVal - dollars) / (maxVal - minVal);
  const toPixels = dollars => (toProportion(dollars) * barHeight) + barPadding;

  return (<div className={"content-container"}>
    <div ref={canvasRef} className={"w-full"} style={{height: barHeight + barPadding}}>
      <Stage width={width} height={height}>
        <Layer>
          <Line points={[barPadding, toPixels(0), width-barPadding, toPixels(0)]} stroke={'#989898'} strokeWidth={0.5}/>
        </Layer>
        <Layer>
          {barGraphData.map((b, idx) => <CategoryBarGraph
            key={idx}
            x={idx * ((width - 2*barPadding - barGraphWidth)/(barGraphData.length-1)) + barPadding} y={barPadding}
            width={barGraphWidth} height={barHeight}
            data={b} minVal={minVal} maxVal={maxVal} />)}
        </Layer>
      </Stage>
    </div>
  </div>)
};

interface CategoryBarGraphProps {
  data: BarGraph;
  minVal: number;
  maxVal: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

const CategoryBarGraph = ({data, minVal, maxVal, height, width, x, y}:CategoryBarGraphProps) => {
  const toProportion = dollars => (maxVal - dollars) / (maxVal - minVal);
  const toPixels = dollars => toProportion(dollars) * height;
  return (
    <>
      <Rect x={x} y={y + toPixels(data.positive)} height={toPixels(0) - toPixels(data.positive)} width={width/2} fill={'#25a225'}/>
      <Rect x={x + width/2} y={y + toPixels(data.positive + data.negative)} height={toPixels(0) - toPixels(data.negative)} width={width/2} fill={'#bd2727'}/>
    </>
  );
};