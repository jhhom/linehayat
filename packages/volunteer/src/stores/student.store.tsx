import { ParentComponent, createContext, useContext } from "solid-js";
import { StudentId } from "@api-contract/types";
import { createStore } from "solid-js/store";

export type Student = {
  status: "typing" | "idle";
};

export const makeStudentContext = () => {
  const [student, setStudent] = createStore<Student>({
    status: "idle",
  });

  return {
    student,
    setStudent,
  };
};

export const StudentContext =
  createContext<ReturnType<typeof makeStudentContext>>();

export const StudentProvider: ParentComponent = (props) => {
  const student = makeStudentContext();

  return (
    <StudentContext.Provider value={student}>
      {props.children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const c = useContext(StudentContext);
  if (c === undefined) {
    throw new Error(`Student Context is undefined`);
  }

  return c;
};
