const API = (() => {
  const URL = "http://localhost:3000/courseList";

  const getCourses = () => {
    return fetch(URL).then((res) => res.json());
  };

  return {
    getCourses,
  };
})();

class CourseModel {
  #courses;
  constructor() {
    this.#courses = [];
  }
  fetchCourses() {
    return API.getCourses().then((courses) => {
      this.setCourses(courses);
      return courses;
    });
  }

  setCourses(courses) {
    this.#courses = courses;
  }
  getCourses() {
    return this.#courses;
  }
}

class CourseView {
  constructor() {
    this.available = document.querySelector("#availableCourses");
    this.selected = document.querySelector("#selectedCourses");
    this.counterNum = document.querySelector("#counterNum");
    this.selectBtn = document.querySelector("#selectBtn");
  }

  renderCourses(courses) {
    courses.forEach((course) => {
      this.appendCourse(course);
    });
  }

  appendCourse(course) {
    const courseElem = document.createElement("li");
    courseElem.classList.add("course");
    courseElem.setAttribute("id", "course" + course.courseId);
    courseElem.setAttribute("data-credit", course.credit);

    const courseNameElem = document.createElement("p");
    courseNameElem.classList.add("course_name");
    courseNameElem.textContent = course.courseName;

    const courseType = document.createElement("p");
    courseType.classList.add("course_type");

    courseType.textContent =
      "Course Type : " + (course.required ? "Compulsory" : "Elective");

    const courseCredit = document.createElement("p");
    courseCredit.classList.add("course_credit");
    courseCredit.textContent = "Course Credit : " + course.credit;

    courseElem.append(courseNameElem, courseType, courseCredit);
    this.available.append(courseElem);
  }
}

class CourseController {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.initialize();
  }

  initialize() {
    this.model.fetchCourses().then((courses) => {
      this.view.renderCourses(courses);
      this.setUpEvents();
    });
  }

  setUpEvents() {
    this.setUpClickCourse();
    this.selectCoursesBtn();
  }
  setUpClickCourse() {
    const elem = document.querySelectorAll(".course");
    let counter = 18;
    elem.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault();

        e.target.parentElement.classList.toggle("select");

        let sum = 0;
        document.querySelectorAll(".select").forEach((elem) =>{
            
            sum = sum + Number(elem.dataset.credit);
            
        })

        this.view.counterNum.textContent = counter - sum;
      });
    });


  }

  selectCoursesBtn() {
    this.view.selectBtn.addEventListener('click', (e) =>{
        e.preventDefault();
        if(Number(this.view.counterNum.textContent) >= 0){
            if (confirm("You have chosen " + this.view.counterNum.textContent + " credits for this semester. You cannot change once you submit. Do you want to confirm?") == true) {
                document.querySelectorAll('.select').forEach((el) => {
                  document.querySelector("#selectedCourses").appendChild(el);
                })
              } 
          
            
        }else{
            alert('You can only choose up to 18 credits in one semester')
        }
    })
  }
}

const courseView = new CourseView();
const courseModel = new CourseModel();
const courseController = new CourseController(courseView, courseModel);
