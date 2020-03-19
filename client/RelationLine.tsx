import React, { useEffect, useRef, FC, useMemo } from 'react'
import { IRelation, CharacterCollection, CharacterId } from './types/type'

interface IRelationLineProps {
  size: number
  relation: IRelation[]
  lineBasePos: CharacterCollection<[number, number][]>
  activeCharacterId: CharacterId | undefined
}

type centerPosList = [string | number, string, {x: number, y: number}][]

const RelationLine: FC<IRelationLineProps> = ({size, relation, lineBasePos, activeCharacterId}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const margin = useMemo(() =>  28, [])
  const radius = useMemo(() => 12, [])

  const baseColor = useMemo<string>(() => '#fff', [])
  const relationShipColor = useMemo<string>(() => '#666', [])
  const positiveColor = useMemo<string>(() => '#ff266b', [])
  const negativeColor = useMemo<string>(() => '#1992f1', [])

  const getContext = (): CanvasRenderingContext2D | null => {
    const canvas = canvasRef.current
    return canvas ? canvas.getContext('2d') : null
  }

  const getShortestDistance = (
    startPosList: [number, number][],
    endPosList: [number, number][]
  ): [[number, number], [number, number], [number, number]] => {
    let minDistance = 0
    let startPos: [number, number] = [0, 0]
    let endPos: [number, number] = [0, 0]
    let startPosDirection = 0
    let endPosDirection = 0

    for (let i = 0; i < startPosList.length; i++) {
      const pos1 = startPosList[i]
      const [x1, y1] = pos1
      for (let j = 0; j < endPosList.length; j++) {
        const pos2 = endPosList[j]
        const [x2, y2] = pos2

        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

        if (distance < minDistance || minDistance === 0) {
          minDistance = distance
          startPos = pos1
          endPos = pos2

          startPosDirection = i
          endPosDirection = j
        }
      }
    }

    return [startPos, endPos, [startPosDirection, endPosDirection]]
  }

  const createLine = (
    canvas: CanvasRenderingContext2D,
    startPos: [number, number],
    endPos: [number, number],
    color: string,
    baseColor: string,
    point: string | number,
    centralPosList: centerPosList
  ): void => {
    const pos = {
      x: (startPos[0] + endPos[0]) / 2,
      y: (startPos[1] + endPos[1]) / 2,
    }

    canvas.beginPath()
    canvas.moveTo(...startPos)
    canvas.lineTo(...endPos)
    canvas.strokeStyle = color
    canvas.lineWidth = 6
    canvas.lineJoin = 'round'
    canvas.lineCap = 'round'
    canvas.stroke()

    canvas.beginPath()
    canvas.moveTo(...startPos)
    canvas.lineTo(...endPos)
    canvas.strokeStyle = baseColor
    canvas.lineWidth = 2
    canvas.lineJoin = 'round'
    canvas.lineCap = 'round'
    canvas.stroke()

    centralPosList.push([point, color, pos])
  }

  const renderRelation = (
    canvas: CanvasRenderingContext2D,
    pair: IRelation,
    centerPosList: centerPosList,
  ): void => {
    const {pairId, positivePoint, negativePoint, isRelationship} = pair
    const [charId1, charId2] = pairId
    const startPosList = lineBasePos[charId1]
    const endPosList = lineBasePos[charId2]

    const [startPos, endPos, directions] = getShortestDistance(startPosList, endPosList)

    const isMultiLine = [positivePoint, negativePoint, isRelationship].filter(item => {
      return item > 0 || item === true
    }).length > 1

    let startPosMargins = [0, 0]
    let endPosMargins = [0, 0]

    if (isMultiLine) {
      const verticalMargin = margin
      let horizontalMargin = margin

      if ((directions.includes(0) && directions.includes(1)) || (directions.includes(2) && directions.includes(3))) {
        // ラインが上から右、または下から左に引かれるならば
        horizontalMargin = -margin
      }
      startPosMargins = directions[0] === 0 || directions[0] === 2 ? [horizontalMargin, 0] : [0, verticalMargin]
      endPosMargins = directions[1] === 0 || directions[1] === 2 ? [horizontalMargin, 0] : [0, verticalMargin]
    }

    if (negativePoint > 0) {
      const negativeStartPos: [number, number] = [startPos[0] + startPosMargins[0], startPos[1] + startPosMargins[1]]
      const negativeEndPos: [number, number] = [endPos[0] + endPosMargins[0], endPos[1] + endPosMargins[1]]

      createLine(canvas, negativeStartPos, negativeEndPos, negativeColor, baseColor, negativePoint, centerPosList)
    }
    if (positivePoint > 0) {
      const positiveStartPos: [number, number] = [startPos[0] - startPosMargins[0], startPos[1] - startPosMargins[1]]
      const positiveEndPos: [number, number] = [endPos[0] - endPosMargins[0], endPos[1] - endPosMargins[1]]

      createLine(canvas, positiveStartPos, positiveEndPos, positiveColor, baseColor, positivePoint, centerPosList)
    }
    if (isRelationship) {
      createLine(canvas, startPos, endPos, relationShipColor, baseColor, '♥', centerPosList)
    }
  }

  const renderPointCircle = (
    canvas: CanvasRenderingContext2D,
    centerPosList: centerPosList
  ): void => {
    for (const centerPos of centerPosList) {
      // ポイントの表記は最前面に出したいため、一番最後に描画処理を行う
      const [point, color, pos] = centerPos

      canvas.beginPath ()
      canvas.arc(pos.x, pos.y, radius, 0 * Math.PI / 180, 360 * Math.PI / 180, false )
      canvas.fillStyle = '#fff'
      canvas.fill()

      canvas.strokeStyle = color
      canvas.lineWidth = 2
      canvas.stroke()

      canvas.font = 'bold 16px selif'
      canvas.fillStyle = color
      canvas.textAlign = 'center'
      canvas.textBaseline = 'middle'
      canvas.fillText(`${point}`, pos.x, pos.y)
    }
  }

  useEffect(() => {
    const canvas: CanvasRenderingContext2D | null = getContext()
    if (canvas) {
      const centerPosList: centerPosList = []
      canvas.clearRect(0, 0, size, size)

      const renderRelationList = activeCharacterId ? (
        relation.filter(pair => pair.pairId.includes(activeCharacterId))
      ) : relation

      for (const pair of renderRelationList) {
        renderRelation(canvas, pair, centerPosList)
      }
      renderPointCircle(canvas, centerPosList)
    }
  })

  return (
    <canvas className={`relation-line`} ref={canvasRef} width={size} height={size} />
  )
}

export default RelationLine