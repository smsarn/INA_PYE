import React from 'react';
import {Bar,Line } from 'react-chartjs-2';
//import './Output.css';
import "./Output.css";

export default function MCCGraph(props) {
	
		props.dataAges.push(100)
        //console.log(props)
        const dataMCCQuoteDB = {
			labels: props.dataAges,
			datasets: [
				{
					label: props.language==="en"?'EquiBuild Quote':"EquiBuild Quote ^F",//Income Shortfall',
					data: props.dataDB,
					fill: true,       
					borderColor: "darkred",  // Line color
					backgroundColor: 'rgba(144, 144, 188, 0.8)',
				}
			]
		};

        const optionsFV = {
			responsive: true, maintainAspectRatio: false,
			scales: {
				xAxes: [{
					stacked: true, ticks: {
						beginAtZero: true
					} },
					],
				yAxes: [{
					stacked: true, ticks: {
						beginAtZero: true,
						steps: 10,
						stepValue: 5,
					
					}
				}]
			}
		};

		return (
			<div>
					<article className="canvas-container" style={{ height: '200px' }}>
						<Bar data={dataMCCQuoteDB} options={optionsFV} />
					</article>
		    </div >
		);
	}

	