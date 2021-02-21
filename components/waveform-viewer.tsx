import React from 'react'

function WaveformBar({width, spacing, barHeight, viewerHeight}) {
  const h = Math.max(1, barHeight)
  const style = {
    width: width + 'px',
    height: h + 'px',
    marginRight: spacing + 'px',
    borderColor: 'rgba(150, 150, 150, 0.3)'
  }
  return <div className="self-center box-border inline-block bg-white border-t border-b" style={style}></div>
}

function summarize(view: DataView, numBars: number): Array<Array<number>> {
  const vals = []
  const bytesPerBar = Math.round(view.byteLength / numBars)
  let negSum = 0
  let posSum = 0
  for (let i = 0; i < view.byteLength; i += 2) {
    const bar = Math.floor((i / view.byteLength) * numBars);
    if (bar > vals.length) {
      vals.push([negSum, posSum])
      negSum = 0
      posSum = 0
    }

    const val = view.getInt16(i, true)
    if (val > 0) {
      posSum += val / bytesPerBar
    } else {
      negSum += val / bytesPerBar
    }
  }

  return vals
}


type WaveformBufferProps = {
  data: DataView,
  width: number,
  height: number,
  barWidth: number,
  barSpacing: number
  padding: number
}

const WaveformViewer = React.memo(({data, width, height, barWidth, barSpacing, padding}: WaveformBufferProps) => {
  if (!data) return null;

  const summary = summarize(data, Math.floor(width / (barWidth + barSpacing)))
  const maxVal = Math.max(...summary.flat().map(v => Math.abs(v)))
  const maxBarHeight = height - padding

  const pixels = summary.map((sums, i) => {
    const barHeight = Math.ceil((sums[1] / maxVal) * maxBarHeight)
    return <WaveformBar key={i} width={barWidth} spacing={barSpacing} barHeight={barHeight} viewerHeight={height} />
  })

  const style = {height: height}

  return (
    <>
      <div className="flex" style={style}>{pixels}</div>
    </>
  )
})
export default WaveformViewer