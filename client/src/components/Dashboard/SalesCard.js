import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { fetchSales } from '../../actions/dashboardActions'

import { Bar } from 'react-chartjs-2'

// Localization 
import T from 'i18n-react'

class SalesCard extends Component {

  state = {
    value: false,
    isLoading: false
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.sales) {
      this.setState({ isLoading: false })
    }
  }

  componentDidMount = () => {
    this.setState({ isLoading: true })
    this.props.fetchSales()
      .catch( ({response}) => this.setState({ isLoading: false }) )
  }

  render() {

    const { value, isLoading } = this.state
    const { sales } = this.props

    const data = sales && sales.lastTwoMonths.length !== 0 && sales.lastTwoMonths[1] && sales.lastTwoMonths[1].data.map(sale => {

      let saleStatusClass          
      switch(sale.status) {
        case 'new':
          saleStatusClass = 'blue-graph'
          break
        case 'in progress':
          saleStatusClass = 'orange-graph'
          break
        case 'overdue':
          saleStatusClass = 'red-graph'
          break
        case 'ready':
          saleStatusClass = 'green-graph' 
          break
        case 'delivered':
          saleStatusClass = 'turquoise-graph' 
          break
         case 'delayed':
          saleStatusClass = 'red-graph' 
          break
        default:
          saleStatusClass = 'undefined'
      }

      return ({theta: sale.count, status: sale.status, className: ''+saleStatusClass+''})
      })

    const tooltipClass = {
      fontSize: '12px',
      background: 'black', 
      opacity: 0.85, 
      color: '#ffffff', 
      padding: '5px', 
      borderRadius: '5px'
    }

    return (
      <div className={classnames("ui card dashboard form", { loading: isLoading })}>
        <div className="content">
          <div className="right floated">
            <h4 className="ui header">
              <i className="cart icon"></i>
            </h4>
          </div> 
          <div className="left floated">
            <h4 className="ui header">
              {T.translate("dashboard.sales.header")}
            </h4>
          </div>       
        </div>

        <div className="image">
          <Bar />
        </div>

        <div className="content">
          <div className="right floated">
            <div className="meta">{T.translate("dashboard.this_month")}</div>
            <div className="header">
              {sales && sales.lastTwoMonths.length !== 0 && sales.lastTwoMonths[1] && sales.lastTwoMonths[1].totalCount}
              {sales && sales.lastTwoMonths.length !== 0 && (sales.lastTwoMonths[0].totalCount > sales.lastTwoMonths[1] && sales.lastTwoMonths[1].totalCount ) ? <i className="long arrow down red icon"></i> : 
              <i className="long arrow up green icon"></i>}
            </div>
          </div>     
          <div className="left floated">
            <div className="meta">{T.translate("dashboard.last_month")}</div>
            <div className="header">{sales && sales.lastTwoMonths.length !== 0 && sales.lastTwoMonths[0].totalCount}</div>
          </div>    
        </div>

        {sales && sales.total && sales.total.count === 0 &&
          <div className="content-btn-outer-container">
            <div className="content-btn-inner-container">
              <Link to="/sales" className="ui primary outline button small">
                <i className="check circle outline icon"></i>{T.translate("dashboard.sales.create_first_sale")}
              </Link>
            </div>
          </div>
        }   
      </div> 
      )
  }  

}

SalesCard.propTypes = {
  fetchSales: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    sales: state.dashboard.sales
  }
}

export default connect(mapStateToProps, { fetchSales }) (SalesCard)
