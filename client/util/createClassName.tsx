export default function createClassName(baseClassName: string | string[], element = '', modifire: string | string[] = []): string {
  const baseClassNameList: string[] = typeof baseClassName === 'string' ? baseClassName.trim().split(' ') : baseClassName
  const modifireClassList: string[] = typeof modifire === 'string' ? [modifire] : modifire

  return (
    baseClassNameList.map((name) => {
      const className = `${name}${element.length > 0 ? `__${element}` : ''}`
      const result = [className]
      for (const modifireName of modifireClassList) {
        if (modifireName.length > 0) {
          result.push(`${className}--${modifireName}`)
        }
      }

      return result.join(' ')
    }).join(' ')
  )
}