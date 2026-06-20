
// 메인 메뉴 클릭 시 스크롤링되며 이동하기
const mainMenu = document.querySelector("#main_menu");
mainMenu.addEventListener('click', (event) => {

  const target = event.target.classList.contains('menu_btn') ? event.target : event.target.parentNode;

  const link = target.dataset.link;
  if (link == null) return;
  mainMenu.classList.remove('open');
  bgMobile.classList.remove('open');
  scrollIntoView(link);
});


// 스크롤 시 해당 섹션의 메뉴를 활성화 시키기
const sectionIds = ['#home', '#about', '#skills', '#work', '#contact'];
const sections = sectionIds.map(id => document.querySelector(id));
const menuItems = sectionIds.map(id => document.querySelector(`[data-link="${id}"]`));

let selectedMenuIndex = 0; // 현재 보이는 섹션
let selectedMenuItem = menuItems[0];
selectedMenuItem.classList.add("active");

function selectMenuItem(selected) {
  selectedMenuItem.classList.remove("active");
  selectedMenuItem = selected;
  selectedMenuItem.classList.add("active");
}

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: 'smooth' });
  selectMenuItem(menuItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3
}

const observerCallback = entries => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) { // 섹션이 화면에서 나갈 때
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      if (entry.boundingClientRect.y < 0) { // 스크롤이 내려가는 경우
        selectedMenuIndex = index + 1;
      } else { // 스크롤이 올라가는 경우
        selectedMenuIndex = index - 1;
      }
    }
  });
}

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => observer.observe(section));

window.addEventListener('wheel', () => {

  if (scrollY === 0) { // 스크롤이 제일 위일 때
    selectedMenuIndex = 0;
  } else if ( // 스크롤이 제일 아래일 때
    Math.round(scrollY + winHeight) >= document.body.clientHeight
  ) {
    selectedMenuIndex = menuItems.length - 1; // 제일 마지막 메뉴 아이템 선택
  }
  selectMenuItem(menuItems[selectedMenuIndex]);

});

// 뷰포트에 등장함에 따라 opacity가 올라가는 section
const observerCallback2 = entries => {
  entries.forEach((entry) => {
    if (entry.target.id === 'home') return;

    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    } else {
      entry.target.classList.remove("active");
    }
  });
};

const sectionAnimationOptions = {
  root: null,
  rootMargin: '0px 0px -20% 0px',
  threshold: 0
};

const observer1 = new IntersectionObserver(observerCallback2, sectionAnimationOptions);
sections.forEach(section => observer1.observe(section));


// 뷰포트에 등장함에 따라 애니메이션 효과가 나타나는 circle
const circles = document.querySelectorAll(".circle");
const observer2 = new IntersectionObserver(observerCallback2, observerOptions);
circles.forEach(circle => observer2.observe(circle));



// home 섹션에 있는 contact 버튼 클릭시 contact 섹션으로 이동하기
const homeContactBtn = document.querySelector(".home_contact");
homeContactBtn.addEventListener('click', () => {
  scrollIntoView("#contact");
});


// 모바일 버튼 클릭하면 모바일 메뉴 등장
const menuMobileBtn = document.querySelector('.btn_mobile');
const bgMobile = document.querySelector('.bg_mobile');
menuMobileBtn.addEventListener('click', () => {
  mainMenu.classList.add('open');
  bgMobile.classList.add('open');
})


// 모바일 메뉴 닫기 
const menuCloseBtn = document.querySelector('.btn_mobile_close');
menuCloseBtn.addEventListener('click', () => {
  mainMenu.classList.remove('open');
  bgMobile.classList.remove('open');
})


// top 버튼 클릭 시 상단으로 이동
const topBtn = document.querySelector('.btn_top');
topBtn.addEventListener('click', () => {
  scrollIntoView("#home");
});


// work섹션 탭 버튼, 필터링
const workBtnContainer = document.querySelector(".work_categories");
const projectContainer = document.querySelector(".work_projects");
const projects = document.querySelectorAll(".project");

workBtnContainer.addEventListener('click', (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if (filter == null) return;

  const active = document.querySelector(".category_btn.selected");
  active.classList.remove("selected");

  const target = e.target.classList.contains('category_btn') ? e.target : e.target.parentNode;
  target.classList.add("selected");

  projectContainer.classList.add('anim-out');
  setTimeout(() => {
    projects.forEach((project) => {
      if (filter === '*' || filter === project.dataset.type) {
        project.classList.remove('invisible');
      } else {
        project.classList.add('invisible');
      }
    }); // setTimeout에 이 함수를 넣어줘야 먼저 애니메이션이 일어나고, 그 뒤에 필터링이 된다.
    projectContainer.classList.remove('anim-out');
  }, 300);
});



// 스크롤 애니메이션 변수
let winHeight = window.innerHeight;

const side = document.querySelector(".side");
const homeSection = document.querySelector("#home");
const aboutSection = document.querySelector("#about");
const skillSection = document.querySelector("#skills");
const homeProfile = document.querySelector(".home_profile");
const aboutProfile = document.querySelector(".about_profile");
const skills = document.querySelectorAll(".skill");

let homeHeight = homeSection.offsetHeight;
let mainRightHeight = document.querySelector(".main_right").offsetHeight;
let aboutTop = aboutSection.offsetTop;
let skillTop = skillSection.offsetTop;

window.addEventListener("resize", () => {
  winHeight = window.innerHeight;
  homeHeight = homeSection.offsetHeight;
  mainRightHeight = document.querySelector(".main_right").offsetHeight;
  aboutTop = aboutSection.offsetTop;
  skillTop = skillSection.offsetTop;
});

let excuted = false;
let ticking = false;

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // home profile
        if (scrollY < homeHeight) {
          homeProfile.style.transform =
            `translate3d(0, ${scrollY * -0.05}px, 0)
             rotate(${scrollY * -0.01 - 10}deg)`;
        }

        // about profile
        if (
          scrollY > aboutTop - winHeight / 2 &&
          scrollY < aboutTop + winHeight
        ) {
          aboutProfile.style.transform =
            `translate3d(0, ${scrollY * -0.05}px, 0)
             rotate(${(scrollY - winHeight) * 0.01}deg)`;
        }

        // side
        if (scrollY < mainRightHeight) {
          side.style.transform =
            `translate3d(0, ${scrollY * -0.25}px, 0)`;
        }

        // skills
        const skillTriggerPoint = skillTop - winHeight / 4;

        if (scrollY > skillTriggerPoint && !excuted) {
          startNumberAnimation();
          excuted = true;
        }

        // top button
        topBtn.classList.toggle(
          "visible",
          scrollY > homeHeight / 2
        );

        ticking = false;
      });

      ticking = true;
    }
  },
  { passive: true }
);


// 숫자 애니메이션 함수 정의
function startNumberAnimation() {
  skills.forEach((skill) => {
    const skillBar = skill.querySelector(".skill_bar");
    const targetRate = parseInt(skillBar.getAttribute("data-num"), 10);
    const skillValue = skill.querySelector(".skill_value");

    skillValue.style.transform = `scaleX(${targetRate / 100})`;
  });
}






