// ===== 프로필 설정 & 내 프로필 보기 =====

function enterProfile(isEdit) {
  document.getElementById('authPage').classList.add('hidden');
  document.getElementById('app').classList.add('hidden');
  document.getElementById('myProfileView').classList.add('hidden');
  document.getElementById('profilePage').classList.remove('hidden');
  document.getElementById('profilePageTitle').textContent = isEdit ? '프로필 수정' : '프로필을 완성해주세요';
  if (currentUser.univ) document.getElementById('profSchool').value = currentUser.univ;
  if (isEdit && currentUser.profile) {
    const p = currentUser.profile;
    document.getElementById('profName').value = p.name || '';
    document.getElementById('profAge').value = p.age || '';
    document.getElementById('profGender').value = p.gender || '';
    document.getElementById('profSchool').value = p.school || '';
    document.getElementById('profMajor').value = p.major || '';
    document.getElementById('profYear').value = p.year || '';
    document.getElementById('profBio').value = p.bio || '';
    document.getElementById('bioCount').textContent = (p.bio || '').length;
    document.getElementById('profHeight').value = p.height || '';
    document.getElementById('profLocation').value = p.location || '';
    document.getElementById('profInsta').value = p.insta || '';
    if (p.showHeight !== undefined) document.getElementById('toggleHeight').checked = p.showHeight;
    if (p.showLocation !== undefined) document.getElementById('toggleLocation').checked = p.showLocation;
    if (p.showInsta !== undefined) document.getElementById('toggleInsta').checked = p.showInsta;
    selectedKeywords = [...(p.keywords || [])];
    document.querySelectorAll('.keyword-btn').forEach(btn => {
      btn.classList.toggle('selected', selectedKeywords.includes(btn.dataset.val));
    });
    document.getElementById('keywordCount').textContent = selectedKeywords.length;
    profilePhotos = [...(p.photos || [])];
    renderPhotoSlots();
  }
  showStep(1);
}

// 다중 사진 업로드
const photoUploadArea = document.getElementById('photoUploadArea');
const photoInput = document.getElementById('photoInput');

document.getElementById('addPhotoSlot').addEventListener('click', () => {
  if (profilePhotos.length >= 6) { alert('최대 6장까지 업로드 가능합니다.'); return; }
  photoInput.click();
});

photoInput.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  const remaining = 6 - profilePhotos.length;
  files.slice(0, remaining).forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => { profilePhotos.push(ev.target.result); renderPhotoSlots(); };
    reader.readAsDataURL(file);
  });
  photoInput.value = '';
});

function renderPhotoSlots() {
  photoUploadArea.innerHTML = '';
  profilePhotos.forEach((src, i) => {
    const slot = document.createElement('div');
    slot.className = 'photo-slot';
    slot.innerHTML = `<img src="${src}" /><button class="photo-remove" data-idx="${i}">&times;</button>`;
    photoUploadArea.appendChild(slot);
  });
  if (profilePhotos.length < 6) {
    const addSlot = document.createElement('div');
    addSlot.className = 'photo-slot';
    addSlot.innerHTML = '<span class="photo-placeholder">+</span>';
    addSlot.addEventListener('click', () => photoInput.click());
    photoUploadArea.appendChild(addSlot);
  }
}

photoUploadArea.addEventListener('click', (e) => {
  if (e.target.classList.contains('photo-remove')) { profilePhotos.splice(Number(e.target.dataset.idx), 1); renderPhotoSlots(); }
});

document.getElementById('profBio').addEventListener('input', (e) => { document.getElementById('bioCount').textContent = e.target.value.length; });

// 프로필 단계 이동
function showStep(n) {
  document.querySelectorAll('.profile-step').forEach(s => s.classList.add('hidden'));
  document.getElementById('step' + n).classList.remove('hidden');
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const st = document.querySelector(`.step[data-step="${n}"]`);
  if (st) st.classList.add('active');
}

document.getElementById('toStep2').addEventListener('click', () => {
  const name = document.getElementById('profName').value.trim();
  const age = document.getElementById('profAge').value;
  const gender = document.getElementById('profGender').value;
  const major = document.getElementById('profMajor').value.trim();
  if (!name || !age || !gender || !major) { alert('이름, 나이, 성별, 전공은 필수입니다.'); return; }
  showStep(2);
});
document.getElementById('backStep1').addEventListener('click', () => showStep(1));
document.getElementById('toStep3').addEventListener('click', () => {
  if (selectedKeywords.length < 3) { alert('키워드를 최소 3개 선택해주세요.'); return; }
  showStep(3);
});
document.getElementById('backStep2').addEventListener('click', () => showStep(2));
document.getElementById('toStep4').addEventListener('click', () => { renderPreview(); showStep(4); });
document.getElementById('backStep3').addEventListener('click', () => showStep(3));

// 키워드 선택
document.querySelectorAll('.keyword-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const v = btn.dataset.val;
    if (btn.classList.contains('selected')) { btn.classList.remove('selected'); selectedKeywords = selectedKeywords.filter(k => k !== v); }
    else { if (selectedKeywords.length >= 10) { alert('최대 10개'); return; } btn.classList.add('selected'); selectedKeywords.push(v); }
    document.getElementById('keywordCount').textContent = selectedKeywords.length;
  });
});

// 공개/비공개 토글
document.querySelectorAll('.toggle-input').forEach(t => {
  t.addEventListener('change', () => { t.closest('.toggle-label').querySelector('.toggle-text').textContent = t.checked ? '공개' : '비공개'; });
});

// 미리보기
function renderPreview() {
  const n = document.getElementById('profName').value.trim(), s = document.getElementById('profSchool').value.trim(),
    mj = document.getElementById('profMajor').value.trim(), y = document.getElementById('profYear').value, a = document.getElementById('profAge').value,
    g = document.getElementById('profGender').value,
    b = document.getElementById('profBio').value.trim(), h = document.getElementById('profHeight').value.trim(),
    l = document.getElementById('profLocation').value.trim(), ig = document.getElementById('profInsta').value.trim();
  document.getElementById('previewName').textContent = n + ' (' + a + ', ' + g + ')';
  document.getElementById('previewSchool').textContent = s + ' / ' + mj + (y ? ' / ' + y : '');
  document.getElementById('previewBio').textContent = b || '자기소개가 없습니다.';
  document.getElementById('previewPhoto').innerHTML = profilePhotos.length > 0 ? `<img src="${profilePhotos[0]}" />` : '<span class="photo-placeholder">?</span>';
  document.getElementById('previewKeywords').innerHTML = selectedKeywords.map(k => `<span class="preview-keyword">${k}</span>`).join('');
  let ext = '';
  if (h && document.getElementById('toggleHeight').checked) ext += `<span class="preview-extra-item">${h}</span>`;
  if (l && document.getElementById('toggleLocation').checked) ext += `<span class="preview-extra-item">${l}</span>`;
  if (ig && document.getElementById('toggleInsta').checked) ext += `<span class="preview-extra-item"><a href="https://instagram.com/${encodeURIComponent(ig.replace('@',''))}" target="_blank">@${escapeHtml(ig.replace('@',''))}</a></span>`;
  document.getElementById('previewExtra').innerHTML = ext;
}

// 프로필 완료
document.getElementById('profileComplete').addEventListener('click', () => {
  currentUser.profile = {
    name: document.getElementById('profName').value.trim(), age: document.getElementById('profAge').value,
    gender: document.getElementById('profGender').value,
    school: document.getElementById('profSchool').value.trim(), major: document.getElementById('profMajor').value.trim(),
    year: document.getElementById('profYear').value, bio: document.getElementById('profBio').value.trim(),
    keywords: [...selectedKeywords], photos: [...profilePhotos],
    height: document.getElementById('profHeight').value.trim(),
    location: document.getElementById('profLocation').value.trim(), insta: document.getElementById('profInsta').value.trim(),
    showHeight: document.getElementById('toggleHeight').checked, showLocation: document.getElementById('toggleLocation').checked,
    showInsta: document.getElementById('toggleInsta').checked,
  };
  currentUser.univ = currentUser.profile.school;
  currentUser.name = currentUser.profile.name;
  enterApp();
});

// 내 프로필 보기
document.getElementById('myProfileBtn').addEventListener('click', () => {
  if (!currentUser || !currentUser.profile) return;
  document.getElementById('app').classList.add('hidden');
  document.getElementById('myProfileView').classList.remove('hidden');
  renderMyProfileView();
});

function renderMyProfileView() {
  const p = currentUser.profile;
  renderPhotoSlider(document.getElementById('myProfilePhotos'), p.photos || [], 0);
  let instaHtml = '';
  if (p.insta && p.showInsta) instaHtml = `<span class="preview-extra-item"><a href="https://instagram.com/${encodeURIComponent(p.insta.replace('@',''))}" target="_blank">@${escapeHtml(p.insta.replace('@',''))}</a></span>`;
  document.getElementById('myProfilePreview').innerHTML = `
    <h3 class="preview-name">${escapeHtml(p.name)} (${p.age}, ${p.gender})</h3>
    <p class="preview-school">${p.school} / ${p.major}${p.year ? ' / ' + p.year : ''}</p>
    <p class="preview-bio">${escapeHtml(p.bio || '자기소개가 없습니다.')}</p>
    <div class="preview-keywords">${(p.keywords || []).map(k => `<span class="preview-keyword">${k}</span>`).join('')}</div>
    <div class="preview-extra">
      ${p.height && p.showHeight ? `<span class="preview-extra-item">${escapeHtml(p.height)}</span>` : ''}
      ${p.location && p.showLocation ? `<span class="preview-extra-item">${escapeHtml(p.location)}</span>` : ''}
      ${instaHtml}
    </div>`;
}

document.getElementById('myProfileBackBtn').addEventListener('click', () => { document.getElementById('myProfileView').classList.add('hidden'); document.getElementById('app').classList.remove('hidden'); });
document.getElementById('myProfileEditBtn').addEventListener('click', () => { document.getElementById('myProfileView').classList.add('hidden'); enterProfile(true); });
