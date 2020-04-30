import React from 'react';
import ReactDOM from 'react-dom';
import initialData from './initial-data';
import '@atlaskit/css-reset';
import Column from './column';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;

`

class InnerList extends React.PureComponent {
  render(){
    const { column , taskMap, index, isDropDisabled } = this.props;
    const tasks = column.taskIds.map(taskId => taskMap[taskId]);
    return <Column column={column} tasks={tasks} index={index} isDropDisabled={isDropDisabled} />
  }
}
class App extends React.Component {
  state = initialData;

  onDragStart = (start, provided) => {
    document.body.style.color = 'orange';
    document.body.style.transition = 'background-color 0.2 ease';

    provided.announce(
      `You have lifted the task in position ${start.source.index + 1}`
    )
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);
    this.setState({
      homeIndex,
    })
  }

  onDragUpdate = (update, provided) => {
    const { destination } = update;
    const opacity = destination ? destination.index / Object.keys(this.state.tasks).length : 0;
    document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;

    const message = update.destination 
    ? `You have moved the task to position ${update.destination.index + 1}`
    : `You have currently not over a droppable area`;
      
    provided.announce(message);
    };

  onDragEnd = (result, provided) => {
    this.setState({
      homeIndex: null
    })

    document.body.style.color = 'inherit';
    document.body.style.backgroundColor = 'inherit';

    const message = result.destination
      ? ` You have moved the task from position ${result.source.index +1} to ${result.destination.index +1}`
      : `The task has been returned to its starting position of ${result.source.index + 1}`

    provided.announce(message);
    console.log(message)
    
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId && 
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(this.state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder,
      }
      this.setState(newState);
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];
    
    if (start === finish){
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0 , draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      }

      const newState = {
        ...this.state, 
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      };
      console.log(newState)
      this.setState(newState)
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start, 
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);

    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      }
    }
    this.setState(newState)
  }

  render(){
    return(
      <DragDropContext 
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}  
        onDragEnd={this.onDragEnd}
      >
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <Container
              ref={provided.innerRef}
              {...provided.droppableProps} 
            >
            {this.state.columnOrder.map((columnId, index) => {
              const column = this.state.columns[columnId];
              const isDropDisabled = index < this.state.homeIndex;
              return (
                <InnerList 
                  key={column.id} 
                  column={column}
                  taskMap={this.state.tasks}                   
                  isDropDisabled={isDropDisabled} 
                  index={index}
                />)
            })}
            {provided.placeholder}
            </Container>
          )}         
         
        </Droppable>
      </DragDropContext>
    )
  }
}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);

