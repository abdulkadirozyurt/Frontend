import { useEffect, useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import axios from "axios";

const defaultCols = [
    {
        id: "applied",
        title: "Applied",
    },
    {
        id: "accepted",
        title: "Accepted",
    },
    {
        id: "rejected",
        title: "Rejected",
    },
];

const defaultTasks = [

];

function generateId() {
    /* Generate a random number between 0 and 10000 */
    return Math.floor(Math.random() * 10001);
}

function KanbanBoard({ candidate, jobId }) {
    const [columns, setColumns] = useState(defaultCols);
    // const [candidate, setCandidate] = useState([])
    const [candidatesForTheJob, setCandidatesForTheJob] = useState([])

    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
    const [loading, setLoading] = useState(false);

    const [tasks, setTasks] = useState(defaultTasks);

    const [activeColumn, setActiveColumn] = useState(null);

    const [activeTask, setActiveTask] = useState(null);
    // const getApplicantById = async () => {
    //     try {
    //         const response = await axios.post(`${process.env.REACT_APP_PORT}/applicant/applicant/jobid`, { jobId: jobId });
    //         console.log(response.data.applicants1)
    //         setCandidate(response.data.applicants1)

    //     } catch (error) {
    //         console.error("Error fetching added candidates:", error);
    //     }
    // };

    useEffect(() => {
        if (!candidate) return;


        // getApplicantById()

        // const getCandidateByJobId = async () => {
        //     try {
        //         const response = await axios.post(`${process.env.REACT_APP_PORT}/applicant/applicant/jobid`, { jobId: jobId });
        //         console.log(response.data.candidatesForTheJob)
        //         setCandidatesForTheJob(response.data.candidatesForTheJob)
        //     } catch (error) {
        //         console.error("Error fetching added candidates:", error);
        //     }
        // };
        // getJobById()


        // axios.post(`${process.env.REACT_APP_PORT}/kanban/kanban/id`, { jobId: jobId })
        //     .then((response) => {
        //         console.log(response.data)
        //     });

        Object.values(candidate).forEach(candidat => {
            if (!candidat || !candidat.candidate) return;
        
            const taskIndex = tasks.findIndex((task) => task.id === candidat.candidate._id);
            if (taskIndex !== -1) {
                // Update existing task
                setTasks((prevTasks) => {
                    const updatedTasks = [...prevTasks];
                    updatedTasks[taskIndex].columnId = candidat.candidate.status;
                    updatedTasks[taskIndex].content = ( <div>
                        <strong>{candidat.candidate.candidateName}</strong>
                        <br />
                    
                        {candidat.candidate.candidateEmail}
                    </div>);
                    return updatedTasks;
                });
            } else {
                // Create new task if candidateId is not found
                setTasks((prevTasks) => [
                    ...prevTasks,
                    {
                        id: candidat.candidate._id,
                        columnId: candidat.candidate.status,
                        content:( <div>
                            <strong>{candidat.candidate.candidateName}</strong>
                            <br />
                         
                            {candidat.candidate.candidateEmail}
                        </div>),
                    },
                ]);
            }
        
            // Add status as column if it doesn't exist
            if (!columnsId.includes(candidat.candidate.status)) {
                if (candidat.candidate.status == "created") return;
                // setColumns((prevColumns) => [
                //     ...prevColumns,
                //     {
                //         id: candidat.candidate.status,
                //         title: candidat.candidate.status,
                //     },
                // ]);
            }
        });
        
    }, [candidate]);


    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    function createTask(columnId) {
        const newTask = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`,
        };

        setTasks([...tasks, newTask]);
    }

    async function deleteTask(id) {
        const response = await axios.post(`${process.env.REACT_APP_PORT}/applicant/applicant/id`, { _id: id });
      
        await axios
            .delete(`${process.env.REACT_APP_PORT}/applicant/applicant`, {
                data: {
                    candidateId: response.data.applicantData.candidateId,
                    jobId: response.data.applicantData.jobId,
                },
            })
            .then((res) => {
                setTasks(tasks => tasks.filter(task => task.id !== id));
                alert(res.data.message);
            });
    }

    function updateTask(id, content) {
        const newTasks = tasks.map((task) => {
            if (task.id !== id) return task;
            return { ...task, content };
        });

        setTasks(newTasks);
    }

    function createNewColumn() {
        const columnToAdd = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
        };

        setColumns([...columns, columnToAdd]);
    }

    function deleteColumn(id) {
        const filteredColumns = columns.filter((col) => col.id !== id);
        setColumns(filteredColumns);

        const newTasks = tasks.filter((t) => t.columnId !== id);
        setTasks(newTasks);
    }

    function updateColumn(id, title) {
        const newColumns = columns.map((col) => {
            if (col.id !== id) return col;
            return { ...col, title };
        });

        setColumns(newColumns);
    }

    function onDragStart(event) {
        if (event.active.data.current?.type === "Column") {
           // setLoading(true)
            setActiveColumn(event.active.data.current.column);
           // setLoading(false)
            return;
        }

        if (event.active.data.current?.type === "Task") {
           // setLoading(true)
            setActiveTask(event.active.data.current.task);
          //  setLoading(false)
            return;
        }
    }

    async function onDragEnd(event) {
        setActiveColumn(null);
        setActiveTask(null);
     
     
       // setLoading(true)

        const { active, over } = event;
        const { task } = active.data.current;


        if (!over) return;
       


        const activeId = active.id;
        const overId = over.id;
      
        const newStatus = overId

        if (activeId === overId) return;
            if(!task){
                return;
            }

        await axios
            .put(`${process.env.REACT_APP_PORT}/applicant/applicant`, { _id: task.id, newStatus: newStatus })
            .then((res) => {

            });
       // setLoading(false)


        const isActiveAColumn = active.data.current?.type === "Column";
        if (!isActiveAColumn) return;



        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

            const overColumnIndex = columns.findIndex((col) => col.id === overId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }

    async function onDragOver(event) {
   
        const { active, over } = event;
        const { task } = active.data.current;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;
    
        const newStatus = overId

      //  setLoading(true)
        await axios
            .put(`${process.env.REACT_APP_PORT}/applicant/applicant`, { _id: task.id, newStatus: newStatus })
            .then((res) => {
            });
      //  setLoading(false)

        await setTasks((tasks) => {
            const taskIndex = tasks.findIndex((task) => task.id === activeId);
            const updatedTask = { ...tasks[taskIndex], columnId: newStatus };
            return [...tasks.slice(0, taskIndex), updatedTask, ...tasks.slice(taskIndex + 1)];
        });

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return;

        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
            await setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                //Burada status set edilecek


                if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
                    // Fix introduced after video recording
                    tasks[activeIndex].columnId = tasks[overIndex].columnId;
                    return arrayMove(tasks, activeIndex, overIndex + 1);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === "Column";

        // Im dropping a Task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);

                tasks[activeIndex].columnId = overId;

                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }

    }

    return (

        <div
            className="
        flex
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        border-3
        p-3
        pb-4
    "
        >
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">

                    <div role="status">
                        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>

                </div>
            )}
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
            >
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <ColumnContainer
                                    key={col.id}
                                    column={col}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
                                    createTask={createTask}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                    tasks={tasks.filter((task) => task.columnId === col.id)}
                                />
                            ))}
                        </SortableContext>
                    </div>
                    {/* <button
                        onClick={() => {
                            createNewColumn();
                        }}
                        className="
      h-[60px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      rounded-lg
      bg-mainBackgroundColor
      border-2
      border-columnBackgroundColor
      p-3
      ring-rose-500
      hover:ring-2
      flex
      gap-2
      font-semibold
      "
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Add Column
                    </button> */}
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer
                                column={activeColumn}
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createTask={createTask}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                                tasks={tasks.filter(
                                    (task) => task.columnId === activeColumn.id
                                )}
                            />
                        )}
                        {activeTask && (
                            <TaskCard
                                task={activeTask}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                            />
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );

}

export default KanbanBoard;