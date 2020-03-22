import React, { FC, useMemo } from 'react'
import createClassName from './util/createClassName'
import Button from './Button'

interface IDialogProps {
  title: string
  classNames?: string
  modifire?: string
  positiveTxt?: string
  negativeTxt?: string
  dangerTxt?: string
  onPositiveFunc?: () => void
  onNegativeFunc?: () => void
  onDangerFunc?: () => void
}

const Dialog: FC<IDialogProps> = ({
  title,
  classNames = '',
  modifire = '',
  positiveTxt,
  negativeTxt,
  dangerTxt,
  onPositiveFunc,
  onNegativeFunc,
  onDangerFunc,
  children,
}) => {
  const positiveBtn = useMemo(() => {
    return positiveTxt ? (
      <Button modifire={'primary'} onClick={onPositiveFunc} isDisabled={onPositiveFunc === undefined}>
        {positiveTxt}
      </Button>
    ) : null
  }, [positiveTxt, onPositiveFunc])
  const negativeBtn = useMemo(() => {
    return negativeTxt ? (
      <Button modifire={'secondary'} onClick={onNegativeFunc} isDisabled={onNegativeFunc === undefined}>
        {negativeTxt}
      </Button>
    ) : null
  }, [negativeTxt, onNegativeFunc])
  const dangerBtn = useMemo(() => {
    return dangerTxt ? (
      <Button modifire={'danger'} onClick={onDangerFunc} isDisabled={onDangerFunc === undefined}>
        {dangerTxt}
      </Button>
    ) : null
  }, [dangerTxt, onDangerFunc])

  const createDialogClass = (element?: string, modifire?: string): string => {
    return createClassName(`dialog ${classNames}`, element, modifire)
  }

  return (
    <div className={createDialogClass('', modifire)}>
      <div className={createDialogClass('box')}>
        <header className={createDialogClass('header')}>
          <h2 className={createDialogClass('title')}>
            {title}
          </h2>
        </header>

        <section className={createDialogClass('body')}>
          <div className={createDialogClass('content')}>
            {children}
          </div>
        </section>

        {
          positiveBtn || negativeBtn || dangerBtn ? (
            <footer className={createDialogClass('footer')}>
              <div className={createDialogClass('btn-group')}>
                {positiveBtn}
                {negativeBtn}
                {dangerBtn}
              </div>
            </footer>
          ) : null
        }
      </div>
    </div>
  )

}

export default Dialog