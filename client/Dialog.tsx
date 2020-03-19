import React, { FC } from 'react'
import createClassName from './util/createClassName'
import Button from './Button'

interface IDialogProps {
  title: string
  classNames?: string
  modifire?: string
  positiveTxt?: string
  negativeTxt?: string
  onPositiveFunc?: () => void
  onNegativeFunc?: () => void
}

const Dialog: FC<IDialogProps> = ({title, classNames = '', modifire = '', positiveTxt = 'OK', negativeTxt = 'Cancel', onPositiveFunc, onNegativeFunc, children}) => {
  const positiveBtn = onPositiveFunc ? (
    <Button modifire={'primary'} onClick={onPositiveFunc}>
      {positiveTxt}
    </Button>
  ) : (null)
  const negativeBtn = onNegativeFunc ? (
    <Button modifire={'secondary'} onClick={onNegativeFunc}>
      {negativeTxt}
    </Button>
  ) : (null)

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

        <footer className={createDialogClass('footer')}>
          <div className={createDialogClass('btn-group')}>
            {positiveBtn}
            {negativeBtn}
          </div>
        </footer>
      </div>
    </div>
  )

}

export default Dialog