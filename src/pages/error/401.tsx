const errorStyled = require('./error.less')

export default function () {
  return (
    <>
    <div className={ errorStyled.status }>
      <img style={{width: '100%'}} alt={500} src={require('../../../src/assets/401.jpg')}/>
    </div>
    </>
  )
}
