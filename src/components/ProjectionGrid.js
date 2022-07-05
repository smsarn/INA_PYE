import React, { Component } from "react";
import DataTable from "./GridExcelComponent/DataTable";
import Loader from 'react-loader-spinner'
import isEqual from 'lodash.isequal';

export class ProjectionGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            projectionGrid: this.props.assetProjection,
        }
        this.dataAges = []
    }

    async componentWillReceiveProps(nextProps) {
        if (!isEqual(nextProps.assetProjection, this.props.assetProjection)) {
           this.setState({ loading: true });
           this.setState({
               projectionGrid: nextProps.assetProjection,
               loading: false,
           })
       }
   }
   async componentDidMount() {
    this.setState({ loading: true });
    this.setState({
        projectionGrid: this.props.assetProjection,
        loading: false,
    })
}
    render() {
        
        const projectionGrid=this.state.projectionGrid
         if (this.state.loading) {// || this.state.projectionGrid===null || this.state.projectionGrid===undefined) {
            return <div class="loader-container"><div class="loader"></div></div>
       {/* <div><Loader type="TailSpin" color="black" height={30} width={30} /></div>; */}
        }
        return (
            <div>
                <DataTable
                    gridTitle={projectionGrid.gridTitle}
                    dataColTitles={projectionGrid.dataColTitles}
                    dataProjection={projectionGrid.dataProjection}
                    
                    language={this.props.lang}
                />
            </div>);
    }
}

