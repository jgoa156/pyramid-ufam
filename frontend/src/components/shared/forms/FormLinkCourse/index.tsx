import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "utils";
import { setCourses } from "redux/slicer/user";
import { store } from "redux/store";

// Shared
import { MultiField, FormAlert } from "components/shared/Form/styles";
import TextInput from "components/shared/TextInput";
import SelectCustom from "components/shared/SelectCustom";
import { Button } from "components/shared/Button";
import Spinner from "components/shared/Spinner";
import Content from "components/shared/ModalForm/Content";
import { toast } from "react-toastify";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";
import IUser from "interfaces/IUser";

interface IFormComponentProps {
  course?: any;
  user: IUserLogged | IUser;
  onChange?: Function;
  handleCloseModalForm?: Function;
  onEditSuccess?: Function;
}

export default function FormLinkCourse({
  course: courseProp = null,
  user,
  onChange = () => { },
  handleCloseModalForm,
  onEditSuccess = () => { },
}: IFormComponentProps) {
  const operation = courseProp == null ? "Vincular" : "Editar";
  const isStudent = user.userTypeId === 3;

  // Inputs and validators
  const [enrollment, setEnrollment] = useState<string>("");
  const handleEnrollment = (value) => {
    setEnrollment(value.toUpperCase());
  };

  const [startYear, setStartYear] = useState<string>("");
  function validateStartYear(value) {
    return value.length === 4 && !isNaN(value) && parseInt(value) > 1909 && parseInt(value) <= new Date().getFullYear();
  }

  // Courses
  const [_courses, _setCourses] = useState<any[]>([]);
  const [fetchingCourses, setFetchingCourses] = useState<boolean>(true);
  async function fetchCourses(search = "") {
    setFetchingCourses(true);

    const options = {
      url: `${process.env.api}/courses?search=${search}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
    };

    try {
      const response = await axios.request(options as AxiosRequestConfig);
      onChange();
      const __courses = response.data.courses.filter((course1) => {
        return !user.courses.some((course2) => course1.id === course2.id);
      });
      _setCourses(__courses);
    } catch (error) {
      const errorMessages = {
        0: "Oops, tivemos um erro. Tente novamente.",
      };

      toast.error(errorMessages[0]);
    } finally {
      setFetchingCourses(false);
    }
  }

  const [courseSearch, setCourseSearch] = useState<string>("");

  useEffect(() => {
    setFetchingCourses(true);
    const debounce = setTimeout(() => {
      fetchCourses(courseSearch);
    }, 1000);

    return () => clearTimeout(debounce);
  }, [courseSearch]);

  const [course, setCourse] = useState<any>();

  // Loading course prop
  useEffect(() => {
    if (courseProp != null) {
      setEnrollment(courseProp?.enrollment);
      setStartYear(courseProp?.startYear.toString());
      setCourse({
        value: courseProp?.id,
        label: courseProp?.name,
      });
    }
  }, [courseProp]);

  // Form state
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Add or Edit
  const handleAddCourse = async (e) => {
    e.preventDefault();
    setSent(true);

    if (course !== null) {
      let data: any = {
        userId: user.id,
        courseId: course?.value ? course?.value : course
      };

      if (isStudent && (enrollment.length !== 0 && validateStartYear(startYear))) {
        data = { ...data, enrollment, startYear };
      }

      if ((isStudent && (enrollment.length !== 0 && validateStartYear(startYear))) || (!isStudent && course !== null)) {
        await fetchAddCourse(data, operation === "Editar");
      }
    }
  };

  const { dispatch } = store;
  async function fetchAddCourse(data, isEdit = false) {
    setFetching(true);

    const options = {
      url: `${process.env.api}/users/${data.userId}/enroll/${data.courseId}`,
      method: isEdit ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
      data: {
        enrollment: data.enrollment,
        startYear: data.startYear,
      },
    };

    try {
      const response = await axios.request(options as AxiosRequestConfig);
      setSuccess(true);
      dispatch(setCourses(response.data));
      onChange();
      toast.success(isEdit ? "Matrícula alterada com sucesso." : "Curso vinculado com sucesso.");

      if (handleCloseModalForm) {
        handleCloseModalForm(); // Close the child modal
      }
      if (onEditSuccess) {
        onEditSuccess(); // Close the parent modal if the callback is provided
      }
    } catch (error) {
      const errorMessages = {
        0: "Oops, tivemos um erro. Tente novamente.",
        400: "Curso já associado ao usuário.",
      };

      setError(
        errorMessages[0]
      );
      setSuccess(false);
    } finally {
      setFetching(false);
    }
  }

  return (
    <Content>
      <div style={{ width: "100%" }}>
        {!courseProp && (
          <SelectCustom
            label={"Curso*"}
            name={"course"}
            inputValue={courseSearch}
            onInputChange={(value) => setCourseSearch(value)}
            value={course}
            handleValue={setCourse}
            defaultInputValue={courseProp?.course?.name}
            defaultValue={{
              value: courseProp?.courseId,
              label: courseProp?.course?.name,
            }}
            options={_courses.map((course) => {
              return {
                value: course.id,
                label: course.name,
              };
            })}
            required={true}
            displayAlert={sent}
            fetching={fetchingCourses}
            noOptionsMessage={"Nenhum curso disponível"}
          />
        )}

        {isStudent && (
          <MultiField>
            <TextInput
              label={"Matrícula*"}
              name={"enrollment"}
              value={enrollment}
              handleValue={handleEnrollment}
              mask={"999999999"}
              required={true}
              displayAlert={sent}
            />

            <TextInput
              label={"Ano de início*"}
              name={"startYear"}
              value={startYear}
              handleValue={setStartYear}
              validate={validateStartYear}
              mask={"9999"}
              required={true}
              alert={"Ano inválido"}
              displayAlert={sent}
            />
          </MultiField>
        )}
      </div>

      <div style={{ width: "100%" }}>
        {sent && !success && error.length !== 0 && (
          <FormAlert>{error}</FormAlert>
        )}

        <Button style={{ marginTop: 15 }} onClick={handleAddCourse}>
          {fetching ? (
            <Spinner size={"20px"} color={"var(--white-1)"} />
          ) : (
            <>
              <i className="bi bi-check2-all" />
              {operation}
            </>
          )}
        </Button>
      </div>
    </Content>
  );
}
