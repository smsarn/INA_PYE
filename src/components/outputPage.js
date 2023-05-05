import React, { Component } from "react";

export default class OutputPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
   
   
    
    const style=(this.props.logoTop===null && this.props.logoBottom===null) ?{}: {marginTop:"-17px", paddingTop:"0px"}
    const styleB=(this.props.logoBottom===null) ?{}: {marginTop:"5px", paddingTop:"0px"}
    const pageClass=(this.props.orientation===undefined || this.props.orientation==="portrait")?"presentationItem page":"presentationItem pageLand"
{

      return (
        <div className={pageClass}>
            
          <div className="INA_MuiGrid-root INA_MuiGrid-container page-wrapper">
            <div className="INA_MuiGrid-root INA_MuiGrid-container INA_MuiGrid-item" style={style}>
             {/* <!-- logo top  --> */}
             {this.props.logoTop}
            
               
              {/* <!-- Header Here  --> */}
              {this.props.header && <div className="INA_MuiGrid-root INA_MuiGrid-container INA_MuiGrid-item printOnly">
                <div className="INA_MuiGrid-root INA_MuiGrid-container INA_MuiGrid-item presentationHeader">
                  <div className="INA_MuiGrid-root INA_MuiGrid-item" data-ppi-noneditable>
                    <h6 className="heading" >
                      {this.props.header}
                    </h6>
                  </div>
                </div>
              </div>}
              <div className="INA_MuiGrid-root INA_MuiGrid-container INA_MuiGrid-item presentationPageContent">
                <div className="INA_MuiGrid-root INA_MuiGrid-container INA_MuiGrid-item">
                  <div className="INA_MuiGrid-root INA_MuiGrid-item">
                    {/* <!-- Content Goes Here  --> */}
                    {this.props.content}
                  </div>
                </div>
              </div>
              {/* <!—Footer Here  --> */}
              <div className="INA_MuiGrid-root INA_MuiGrid-container INA_MuiGrid-item" >
                <div className="INA_MuiGrid-root INA_MuiGrid-container">
                  <div className="INA_MuiGrid-root INA_MuiGrid-item printOnly" style={styleB} data-ppi-noneditable>

                    <span className="presentationFooterText">
                    {this.props.footer}
                    </span>
                   
                  </div>
                   {/* <!-- logo bottom  --> */}
            <div className="INA_MuiGrid-root INA_MuiGrid-container INA_MuiGrid-item">
                      {this.props.logoBottom }
                      </div>
                </div>
              </div>
                
            </div>
           
          </div>
        </div>
      );
    }
  }
}
