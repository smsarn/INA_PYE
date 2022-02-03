import React, { useState,useEffect } from "react";
import DataTable from "./GridExcelComponent/DataTable";



export default function ProjectionGrid1({assetProjection,lang}) {
    const [projectionGrid, setProjectionGrid] = useState(assetProjection);

  
    useEffect(() => {
        /* getGridData(input, assetCurr)
            .then(response => response.json())
            .then(data => setProjectionGrid(data)); */

           setProjectionGrid(assetProjection)
    }, [assetProjection])


    //if(projectionGrid!==null && projectionGrid!==undefined){
    return (
        <div>
         
            { assetProjection ?
            <DataTable
                gridTitle={projectionGrid.gridTitle}
                dataColTitles={  projectionGrid.dataColTitles}
                dataProjection={projectionGrid.dataProjection}
                
                language={lang}
            /> : null}
        </div>);
}

