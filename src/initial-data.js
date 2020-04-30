const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: "take out garbage"},
    'task-2': { id: 'task-2', content: "take out garbageMen"},
    'task-3': { id: 'task-3', content: "take out"},
    'task-4': { id: 'task-4', content: "take out hotsauce"},
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4']
    },
    'column-2': {
      id: 'column-2',
      title: 'in Progress',
      taskIds: []
    },    
  },
  // Facilitate reordering of columns
  columnOrder: ['column-1', 'column-2']
}

export default initialData;

// ,'column-3'

/*  'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: []
    },

    */