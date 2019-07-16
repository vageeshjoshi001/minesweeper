import React from 'react';
import './App.css';
import { Button, ButtonGroup, ButtonToolbar, Col, Row, Input, FormGroup } from 'reactstrap';

const initialState = {
  row: 0,
  col: 0,
  tableValues: [[]],
  matrix: [[]],
  displayOutput: false,
} 

class App extends React.Component {
  constructor(props) {
    super(props); 
    this.state = initialState;
  }

  resetGame = () => {
    this.setState({
      ...initialState,
    });
  }

  tableUIGenerator = (rowNum = 0, colNum = 0, values = [], mode = '') => {
    let table = [];
    for(let row = 0; row < parseInt(rowNum,10); row++) {
      let rowBtns = [];
      const rowValues = values[row] || [];
      for(let col = 0; col < parseInt(colNum,10); col++) {
        rowBtns[col] = (mode === 'input'
        ? <Input className="max-w-50" type="number" value={rowValues[col] || undefined} onChange={(event) => this.tableInputChangeHandler(event, row, col)}/>
        : <Button>{rowValues[col]}</Button>
        );
      }
      table[row] = <div className="justify-content-center form-inline" style={{width:'100%'}}>
          {(mode === 'input')
            ? <FormGroup>{rowBtns}</FormGroup>
            : <ButtonGroup> {rowBtns} </ButtonGroup>
          }
        </div>;
    }
    return table;
  }

  tableInputChangeHandler = ({ target: { value = 0 } }, row, col) => {
    let { tableValues } = this.state;
    let rowValue = tableValues[row] || [];
    rowValue[col] = value && 1;
    tableValues[row] = rowValue;
    this.setState({
      tableValues
    });
  }

  onTableAttributesChange = ({ target: { value = 0 } }, key) => {
    this.setState({
      [key]: value, 
    });
  }

  calculateBombNumber = (rowNum, colNum) => {
    const { tableValues } = this.state;
    const currentPosition = tableValues[rowNum] || [];
    if(currentPosition[colNum] === 1) {
      return 9;
    }
    else {
      let adjacentBombs = 0;
      for(let row = rowNum - 1; row <= rowNum + 1; row++) {
        const rowValue = tableValues[row] || [];
        for(let col = colNum - 1; col <= colNum + 1; col++) {
          if (!(col == colNum && row == rowNum) && rowValue[col] === 1) {
            adjacentBombs++;
          }
        }
      }
      return adjacentBombs;
    }
  }

  changeMode = () => {
    this.setState({
      displayOutput: !this.state.displayOutput,
    }, () => this.generateMatrix());
  }

  generateMatrix = () => {
    const { row, col } = this.state;
    let { matrix } = this.state;
    for(let rowNum = 0; rowNum < row; rowNum++) {
      const rowValues = matrix[row] || [];
      for(let colNum = 0; colNum < col; colNum++) {
        rowValues[colNum] = this.calculateBombNumber(rowNum, colNum);
      }
      matrix[rowNum] = rowValues;
    }
    this.setState({ matrix });
  }

  render() {
    const { row = 0, col = 0, tableValues, matrix, displayOutput } = this.state;
    console.log(this.state);
    return (
      <div className="App">
        MineSweeper

        <Row>
          <Col lg="4">
            Please provide the following details:
            <Row>
              <Col lg="4">
                The number of rows: 
              </Col>
            
              <Col lg="4">
                <Input type="number" value={row || 0} onChange={(event) => this.onTableAttributesChange(event, 'row')}/>
              </Col>
            </Row>

            <Row>
              <Col lg="4">
                The number of cols: 
              </Col>
            
              <Col lg="4">
                <Input type="number" value={col || 0} onChange={(event) => this.onTableAttributesChange(event, 'col')}/>
              </Col>
            </Row>
          </Col>

          <Col lg="4">
            <ButtonToolbar>
              {this.tableUIGenerator(row, col, tableValues, 'input')}
            </ButtonToolbar>
            <Button onClick={this.changeMode}>Generate Matrix</Button>
            <Button onClick={this.resetGame}>Reset Game</Button>
          </Col>

          <Col lg="4">
            {(displayOutput) && this.tableUIGenerator(row, col, matrix)}
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
