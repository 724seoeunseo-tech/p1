// ===== 상수 & 가상 유저 생성 =====
const SCHOOLS = ['한국항공대','서강대','연세대','홍익대','이화여대'];
const MAJORS_BY_SCHOOL = {
  '한국항공대': ['항공우주공학','항공전자공학','소프트웨어학','항공교통물류학','기계공학','경영학','항공운항학','항공재료공학'],
  '서강대': ['컴퓨터공학','경영학','경제학','심리학','영문학','화학','물리학','수학','사회학','철학'],
  '연세대': ['컴퓨터공학','경영학','의예과','전기전자공학','심리학','경제학','국문학','화학공학','생명공학','정치외교학'],
  '홍익대': ['시각디자인','산업디자인','건축학','미술학','경영학','컴퓨터공학','영문학','광고홍보학','도예유리과','섬유미술패션디자인'],
  '이화여대': ['컴퓨터공학','경영학','국제학','심리학','약학','간호학','영문학','미디어학','화학','교육학'],
};
const YEARS = ['1학년','2학년','3학년','4학년'];
const GENDERS_BY_SCHOOL = { '이화여대': ['여성'], default: ['남성','여성'] };
const ALL_KEYWORDS = ['운동','독서','게임','음악','영화','여행','사진','요리','그림','댄스','등산','캠핑','한식','일식','중식','양식','카페','디저트','매운음식','치킨','피자','분식','활발한','조용한','유머러스','다정한','지적인','감성적','모험적','계획적'];
const LAST_NAMES = ['김','이','박','최','정','강','조','윤','장','임','한','오','서','신','권','황','안','송','류','전'];
const MALE_FIRST = ['민준','서준','예준','도윤','시우','하준','주원','지호','지후','준서','현우','도현','수호','지훈','우진','태민','성민','재현','건우','정우'];
const FEMALE_FIRST = ['서연','서윤','지우','서현','하은','하윤','민서','지유','윤서','채원','수빈','지민','예은','소율','다은','하린','유진','소희','지현','예진'];
const BIOS = [
  '대학생활 열심히 하는 중!','맛집 탐방이 취미예요','운동 같이 할 사람 구해요','카페에서 공부하는 걸 좋아해요',
  '코딩하면서 밤새는 사람','영화 보는 게 제일 좋아요','여행 계획 세우는 중!','음악 없이 못 살아요',
  '게임 같이 할 친구 구함','독서 모임 관심 있어요','사진 찍는 거 좋아해요','요리 배우고 싶어요',
  '등산 초보인데 같이 가요','캠핑 러버입니다','그림 그리는 걸 좋아해요','댄스 동아리 소속이에요',
  '스터디 같이 해요!','자취 생활 꿀팁 공유','동아리 활동 열심히 하는 중','취업 준비 화이팅!',
];
const LOCATIONS = ['서울 마포구','서울 서대문구','서울 강남구','서울 관악구','서울 성동구','경기 고양시','경기 성남시','서울 동대문구','서울 용산구','서울 종로구','인천 연수구','경기 수원시'];
const INSTA_PREFIXES = ['_','xx','0','dear_','hi_','the_','my','love_'];
const GATHER_CATS = { study:'스터디', hobby:'취미', food:'맛집탐방', exercise:'운동', travel:'여행', project:'프로젝트', etc:'기타' };
const GATHER_EMOJIS = { study:'📚', hobby:'🎨', food:'🍽️', exercise:'💪', travel:'✈️', project:'💻', etc:'✨' };
const CAT_LABELS = { free:'자유게시판', question:'질문답변', info:'정보공유', review:'대학생활' };

function generateUsers() {
  const users = [];
  let id = 1;
  SCHOOLS.forEach(school => {
    const majors = MAJORS_BY_SCHOOL[school];
    const genders = GENDERS_BY_SCHOOL[school] || GENDERS_BY_SCHOOL.default;
    for (let i = 0; i < 100; i++) {
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const firstNames = gender === '남성' ? MALE_FIRST : FEMALE_FIRST;
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const name = lastName + firstName;
      const major = majors[Math.floor(Math.random() * majors.length)];
      const year = YEARS[Math.floor(Math.random() * YEARS.length)];
      const age = String(19 + Math.floor(Math.random() * 8));
      const height = String(gender === '남성' ? 165 + Math.floor(Math.random() * 20) : 155 + Math.floor(Math.random() * 16)) + 'cm';
      const kw = [...ALL_KEYWORDS].sort(() => .5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 4));
      const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const instaId = INSTA_PREFIXES[Math.floor(Math.random() * INSTA_PREFIXES.length)] + firstName.toLowerCase() + (Math.random() < 0.5 ? Math.floor(Math.random() * 100) : '');
      users.push({
        id: id++, name, email: name.toLowerCase() + id + '@univer.kr',
        school, major, year, age, gender, bio: BIOS[Math.floor(Math.random() * BIOS.length)],
        keywords: kw, photos: [],
        height, location, insta: instaId,
        showHeight: Math.random() > 0.3, showLocation: Math.random() > 0.3, showInsta: Math.random() > 0.2,
      });
    }
  });
  return users;
}

const ALL_USERS = generateUsers();

// ===== 공용 함수 =====
function getUserById(id) { return ALL_USERS.find(u => u.id === id); }
function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function formatDate(date) {
  const diff = Date.now() - date;
  const m = Math.floor(diff / 60000);
  if (m < 1) return '방금 전';
  if (m < 60) return m + '분 전';
  const h = Math.floor(m / 60);
  if (h < 24) return h + '시간 전';
  const d2 = Math.floor(h / 24);
  if (d2 < 7) return d2 + '일 전';
  return new Date(date).toLocaleDateString('ko-KR');
}

// ===== 공유 상태 =====
let currentUser = null;
let currentTab = 'friends';
let matched = new Set();
let sentOK = new Set();
let receivedRequests = new Set();
let dmChats = {};
let recSettings = { location:'', school:'', major:'', ageMin:'', ageMax:'', gender:'', heightMin:'', heightMax:'' };
let selectedKeywords = [];
let profilePhotos = [];
let swipeQueue = [];
let swipeIndex = 0;
let currentChatType = null;
let currentChatId = null;
let chatTabFilter = 'group';
let currentSort = 'latest';
let currentPage = 1;
let currentPostId = null;
let boardSchool = '';

// 스플래시
setTimeout(() => document.getElementById('splash').style.display = 'none', 3600);

// 시뮬레이션: 초기 친구요청 & 매칭
(function simulateRequests() {
  const schoolUsers = ALL_USERS.filter(u => u.school === '서강대');
  for (let i = 0; i < 8; i++) receivedRequests.add(schoolUsers[Math.floor(Math.random() * schoolUsers.length)].id);
  for (let i = 0; i < 5; i++) matched.add(schoolUsers[10 + i].id);
  matched.forEach(fid => {
    const u = getUserById(fid);
    if (u && Math.random() > 0.5) {
      dmChats[fid] = [{ author: fid, text: '안녕하세요! 반갑습니다 :)', date: new Date(Date.now() - 3600000 * 2) }];
    }
  });
})();

// 사진 슬라이더 유틸
function renderPhotoSlider(container, photos, startIdx) {
  let idx = startIdx || 0;
  function render() {
    if (!photos || photos.length === 0) { container.innerHTML = '<div class="slider-placeholder">?</div>'; return; }
    const dots = photos.map((_, i) => `<span class="slider-dot ${i === idx ? 'active' : ''}"></span>`).join('');
    container.innerHTML = `
      <button class="slider-btn slider-prev">&lsaquo;</button>
      <img class="slider-img" src="${photos[idx]}" />
      <button class="slider-btn slider-next">&rsaquo;</button>
      <div class="slider-dots">${dots}</div>`;
    container.querySelector('.slider-prev').addEventListener('click', (e) => { e.stopPropagation(); idx = (idx - 1 + photos.length) % photos.length; render(); });
    container.querySelector('.slider-next').addEventListener('click', (e) => { e.stopPropagation(); idx = (idx + 1) % photos.length; render(); });
  }
  render();
}

// 탭/서브페이지 전환
function showSubPage(id) { document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden')); document.getElementById(id).classList.remove('hidden'); }
