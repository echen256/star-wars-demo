import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import React, { useEffect, useState } from "react"
//import { LineChart, Line, BarChart, XAxis, CartesianGrid, YAxis, Tooltip, Legend, Bar , ResponsiveContainer} from 'recharts';
import { Card, Checkbox, Divider, H3, HTMLTable, Slider } from "@blueprintjs/core"
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import JediSymbol from "./../src/jedi2.webp"
import Globe from "./../src/globe.webp"
import WireGlobe from "./../src/wire-globe.svg"

function App() {

  const [state, setState] = useState({
    loading: true,
    planets: [],
    allPlanets : [],
    paginationDetails: {
      page: 1,
      total: 0,
      perPage: 10,
      min: 1
    },
    categoryOptions: {
      population: true,
      rotation_period: false,
      orbital_period: false,
      diameter: false,
      surface_water: false,
    },
    plotOptions: {
      logarithmic: true
    }
  })

  useEffect(() => {
    loadAllContent();
  }, [])

  useEffect(() => {
    state.planets = getCurrentPlanets(state.paginationDetails.page)
    setState({...state})
  }, [state.paginationDetails.page])
 
  const getCurrentPlanets = (page) => {
    page = page - 1;

    return state.allPlanets.slice(page * state.paginationDetails.perPage, state.paginationDetails.perPage + state.paginationDetails.perPage * page)
  }


  const loadAllContent = async () => {
    try {
      let hasMore = true;
      let allPlanets = []
      let total = 0;
      let page = 1;
      while (hasMore) {
        let res = await axios.get(' https://swapi.dev/api/planets/', { params: { page , ordering : "name"} })
        let data = res.data;
        allPlanets = allPlanets.concat(data.results)
        total = data.count;
        page++;
        if (data.next === null) {
          hasMore = false;
        }
      }
     
      let paginationDetails = {
        ...state.paginationDetails,
        total
      }

      allPlanets = allPlanets.sort((a,b) => {
        return a.name.localeCompare(b.name)
      }) 
      state.allPlanets = allPlanets
      setState({
        ...state,
        paginationDetails, loading: false, allPlanets , planets : getCurrentPlanets(state.paginationDetails.page)
      })
    } catch (error) {
      setState({
        loading: false,
        planets: [],
        error: error.message
      })
    }
  }

  const setPagination = (page) => {
  
    state.paginationDetails.page = page;
    setState({ ...state })
  }

  return (
    <div className="background"> 
     
       <div style={{ display: "flex", zIndex : 1 }}>
        <div style={{ flexGrow: 6 }} className="vertical-container" >
          <PopulationChart state={state} setState={setState} setPagination={setPagination} />
          <br />
          <PlanetaryTable state={state} setState={setState} setPagination={setPagination} />
        </div>
        <div style={{ flexGrow: 1 }} className="vertical-container">
          <OptionsBar state={state} setState={setState} />
        </div>
      </div>  

    </div>
  );
}

const OptionsBar = (props) => {

  const { state, setState } = props;

  const { categoryOptions, plotOptions } = state
  const handleCheckbox = (parentObjName, name) => {
    state[parentObjName][name] = ! state[parentObjName][name]
    setState({ ...state,  [parentObjName ] :  state[parentObjName] })
  }

  return <Container>
    <div style={{ margin: 'auto', marginTop: "20px", width: 'fit-content' }}>
      <picture>
        <img srcSet={JediSymbol} style={{ width: "200px", margin: 'auto' }} />
      </picture>
    </div>
    <hr />
    <div style={{ margin: "10px" }}>
      Data Field Options
      <div style={{ margin: "10px" }}>
      
        <Checkbox className = "checkbox-label" checked={categoryOptions.population} label="Population" onChange={() => { handleCheckbox("categoryOptions", "population") }} />
        <Checkbox className = "checkbox-label" checked={categoryOptions.rotation_period}  label="Rotational Period" onChange={() => { handleCheckbox("categoryOptions", "rotation_period") }} />
        <Checkbox className = "checkbox-label" checked={categoryOptions.orbital_period}   label="Orbital Period" onChange={() => { handleCheckbox("categoryOptions", "orbital_period") }} />
        <Checkbox className = "checkbox-label" checked={categoryOptions.diameter}   label="Diameter" onChange={() => { handleCheckbox("categoryOptions", "diameter") }} />
        <Checkbox className = "checkbox-label" checked={categoryOptions.surface_water}   label="Surface Water" onChange={() => { handleCheckbox("categoryOptions", "surface_water") }} />
      </div>

      <hr />
      Plot Options
      <div style={{ margin: "10px" }}>
      
        <Checkbox className = "checkbox-label" checked={plotOptions.logarithmic}  label="Logarithmic Display" onChange={() => { handleCheckbox("plotOptions", "logarithmic") }} />

      </div>

      <hr/>
  <br/>
<div style = {{display : "flex", flexDirection : "column-reverse", width : "fit-content", fontSize : "10pt"}}>
<div className = "arubesh">
      There is no emotion, there is peace. There is no ignorance, there is knowledge. There is no passion, there is serenity.
        </div>
  </div>
     
    </div>
  </Container>
}

const formatFieldName = (fieldName) => {
  let strings = fieldName.split("_")
  let output = ""
  strings.forEach((s) => {
    output+= s[0].toUpperCase() + s.slice(1) + " "
  })
  return output
}

const SeriesConfig = {
  population : {
    color : "red",
    tooltip: {
      valueSuffix: ' Million'
    },
  },
  rotation_period: {
    color : "orange",
    tooltip: {
      valueSuffix: ' Standard Hours'
    },
  },
  orbital_period : {
    color : "white",
    tooltip: {
      valueSuffix: ' Standard Hours'
    },
  },
  diameter : {
    color : "#45062E",
    tooltip: {
      valueSuffix: ' Kilometers'
    },
  },
  surface_water: {
    color : "lightGray",
    tooltip: {
      valueSuffix: '%'
    },
  },
}

const PopulationChart = (props) => {
  const { state, setPagination } = props

  const { categoryOptions, plotOptions } = state

  let categories = state.planets.map((planet) => { return planet.name })

  let series = [] 
  Object.keys(categoryOptions).forEach((option) => {
    if (categoryOptions[option]) {
      let data = state.planets.map((planet) => {
        if (option === "population") {
          return parseInt(planet.population) / 1000000
        }
        return parseInt(planet[option])
      })
      series.push({ name: formatFieldName(option), data, ...SeriesConfig[option] })
    }
  })

  let options = {
    chart: {
      type: 'bar', backgroundColor: "transparent" 
    }, 
    legend : {
      itemStyle : {
        color : "white"
      }
    },
    title: {
      text: ""
    }, 
    xAxis: {
      categories: categories,
      title: {
        text: null
      }
    },
    yAxis: {
      min: plotOptions.logarithmic && .0001,
      type: plotOptions.logarithmic ?  'logarithmic' : "linear"
    }, 
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        }
      }
    },
    credits: {
      enabled: false
    },
    series: series
  }

  return <Container>

    <h3>Planetary Statistics</h3>
    <LoadingBlurOut loading={state.loading} ><HighchartsReact
      highcharts={Highcharts}
      options={options}
    /></LoadingBlurOut>


    <Pagination paginationDetails={state.paginationDetails} setPagination={setPagination} />

  </Container>
}

const LoadingBlurOut = (props) => {
  return <div style={{ opacity: props.loading ? .5 : 1 }} >
    {
      props.children
    }
  </div>
}

const PlanetaryTable = (props) => {
  const { state, setState, setPagination } = props




  return <div>  <Container><h3>Planetary Information</h3> <LoadingBlurOut loading={state.loading} ><HTMLTable bordered condensed striped style={{ color: 'white', width: "100%" }}>
    <thead>
      <tr>
        <th className="th">
          Name
        </th>
        <th className="th">
          Population
        </th>
        <th className="th">
          Rotation Period
        </th>
        <th className="th">
          Orbital Period
        </th>
        <th className="th">
          Diameter
        </th>
        <th className="th">
          Climate
        </th>
        <th className="th">
          Surface Water
        </th>
      </tr>
    </thead>
    <tbody>
      {
        state.planets.map((planet) => {
          return <tr>
            <td className="td">{planet.name}</td>
            <td className="td">{planet.population}</td>
            <td className="td">{planet.rotation_period}</td>
            <td className="td">{planet.orbital_period}</td>
            <td className="td">{planet.diameter}</td>
            <td className="td">{planet.climate}</td>
            <td className="td">{planet.surface_water}</td>
          </tr>
        })
      }
    </tbody>
  </HTMLTable></LoadingBlurOut>
    <Pagination paginationDetails={state.paginationDetails} setPagination={setPagination} />
  </Container></div>
}

const Container = (props) => {
  return <div className="container">
    {
      props.children
    }
  </div>
}

const Pagination = (props) => {
  let { paginationDetails, setPagination } = props;
  let max = (paginationDetails.total / paginationDetails.perPage)
  if (max < 1) {
    return <Card className="bp4-skeleton" />
  }
  return <div style={props.style || { width: "200px", marginLeft: "auto", marginRight: "20px", color: "white", fontSize: "10pt" }}>
    <div >Page Number </div>
    <Divider />

    <Slider
      intent="danger"
      min={paginationDetails.min}
      max={max}
      stepSize={1}
      labelStepSize={1}
      onChange={setPagination}
      value={paginationDetails.page}

    /></div>
}

export default App;
