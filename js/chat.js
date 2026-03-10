// ===== 채팅 시스템 (모임 채팅 + 개인 DM) =====

function renderChatRooms() {
  document.getElementById('chatListView').classList.remove('hidden');
  document.getElementById('chatRoomView').classList.add('hidden');
  currentChatType = null;
  currentChatId = null;
  document.querySelectorAll('[data-ctab]').forEach(btn => btn.classList.toggle('active', btn.dataset.ctab === chatTabFilter));

  const el = document.getElementById('chatRoomList');
  if (chatTabFilter === 'group') {
    const myRooms = gatherings.filter(g => currentUser && g.members.includes(currentUser.id));
    if (myRooms.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128101;</div><div class="empty-state-text">참여 중인 모임 채팅이 없습니다.</div></div>'; return; }
    el.innerHTML = myRooms.map(g => {
      const last = g.chatMessages.length > 0 ? g.chatMessages[g.chatMessages.length - 1] : null;
      const lastAuthor = last ? getUserById(last.author) : null;
      return `<div class="chat-room-item" data-type="group" data-gid="${g.id}"><div class="chat-room-info"><div class="chat-room-icon">${GATHER_EMOJIS[g.category] || '💬'}</div><div><div class="chat-room-name">${escapeHtml(g.title)}</div><div class="chat-room-last">${last ? (lastAuthor ? lastAuthor.name + ': ' : '') + escapeHtml(last.text).substring(0, 25) : '메시지 없음'}</div></div></div>
      <div class="chat-room-meta"><div class="chat-room-time">${last ? formatDate(last.date) : ''}</div><div style="font-size:.75rem;color:var(--text-secondary)">${g.members.length}명</div></div></div>`;
    }).join('');
  } else {
    const allFriends = [...matched];
    if (allFriends.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128172;</div><div class="empty-state-text">친구를 추가하면 개인 채팅을 할 수 있습니다.</div></div>'; return; }
    allFriends.sort((a, b) => {
      const aLast = dmChats[a] && dmChats[a].length > 0 ? dmChats[a][dmChats[a].length - 1].date : 0;
      const bLast = dmChats[b] && dmChats[b].length > 0 ? dmChats[b][dmChats[b].length - 1].date : 0;
      return bLast - aLast;
    });
    el.innerHTML = allFriends.map(fid => {
      const u = getUserById(fid);
      if (!u) return '';
      const msgs = dmChats[fid] || [];
      const last = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      return `<div class="chat-room-item" data-type="dm" data-uid="${fid}"><div class="chat-room-info"><div class="chat-room-icon dm">${u.name[0]}</div><div><div class="chat-room-name">${escapeHtml(u.name)}</div><div class="chat-room-last">${last ? escapeHtml(last.text).substring(0, 25) : '대화를 시작하세요'}</div></div></div>
      <div class="chat-room-meta"><div class="chat-room-time">${last ? formatDate(last.date) : ''}</div></div></div>`;
    }).join('');
  }
}

document.querySelectorAll('[data-ctab]').forEach(btn => btn.addEventListener('click', () => { chatTabFilter = btn.dataset.ctab; renderChatRooms(); }));

document.getElementById('chatRoomList').addEventListener('click', (e) => {
  const item = e.target.closest('.chat-room-item');
  if (!item) return;
  if (item.dataset.type === 'group') openGroupChat(Number(item.dataset.gid));
  else if (item.dataset.type === 'dm') openDmChat(Number(item.dataset.uid));
});

function openGroupChat(gid) {
  const g = gatherings.find(x => x.id === gid);
  if (!g) return;
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById('tabChat').classList.remove('hidden');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const chatLink = document.querySelector('.nav-link[data-tab="chat"]');
  if (chatLink) chatLink.classList.add('active');
  currentChatType = 'group';
  currentChatId = gid;
  document.getElementById('chatListView').classList.add('hidden');
  document.getElementById('chatRoomView').classList.remove('hidden');
  document.getElementById('chatRoomName').textContent = g.title;
  document.getElementById('chatMemberCount').textContent = g.members.length + '명';
  renderGroupMsgs(g);
}

function renderGroupMsgs(g) {
  const el = document.getElementById('chatMessages');
  if (g.chatMessages.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-text">첫 메시지를 보내보세요!</div></div>'; return; }
  el.innerHTML = g.chatMessages.map(m => {
    const mine = currentUser && m.author === currentUser.id;
    const u = getUserById(m.author);
    return `<div class="chat-msg ${mine ? 'mine' : 'other'}">${!mine ? `<div class="chat-msg-author">${u ? escapeHtml(u.name) : '알 수 없음'}</div>` : ''}<div class="chat-msg-bubble">${escapeHtml(m.text)}</div><div class="chat-msg-time">${formatDate(m.date)}</div></div>`;
  }).join('');
  el.scrollTop = el.scrollHeight;
}

function openDmChat(friendId) {
  document.getElementById('userProfileModal').classList.remove('active');
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById('tabChat').classList.remove('hidden');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const chatLink = document.querySelector('.nav-link[data-tab="chat"]');
  if (chatLink) chatLink.classList.add('active');
  currentChatType = 'dm';
  currentChatId = friendId;
  const u = getUserById(friendId);
  document.getElementById('chatListView').classList.add('hidden');
  document.getElementById('chatRoomView').classList.remove('hidden');
  document.getElementById('chatRoomName').textContent = u ? u.name : '채팅';
  document.getElementById('chatMemberCount').textContent = '';
  if (!dmChats[friendId]) dmChats[friendId] = [];
  renderDmMsgs(friendId);
}

function renderDmMsgs(friendId) {
  const msgs = dmChats[friendId] || [];
  const el = document.getElementById('chatMessages');
  if (msgs.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-text">첫 메시지를 보내보세요!</div></div>'; return; }
  el.innerHTML = msgs.map(m => {
    const mine = m.author === (currentUser ? currentUser.id : -1);
    const authorName = mine ? '나' : (getUserById(m.author)?.name || '');
    return `<div class="chat-msg ${mine ? 'mine' : 'other'}">${!mine ? `<div class="chat-msg-author">${escapeHtml(authorName)}</div>` : ''}<div class="chat-msg-bubble">${escapeHtml(m.text)}</div><div class="chat-msg-time">${formatDate(m.date)}</div></div>`;
  }).join('');
  el.scrollTop = el.scrollHeight;
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || !currentChatType) return;
  input.value = '';

  if (currentChatType === 'group') {
    const g = gatherings.find(x => x.id === currentChatId);
    if (!g) return;
    g.chatMessages.push({ author: currentUser.id, text, date: new Date() });
    renderGroupMsgs(g);
    setTimeout(() => {
      const others = g.members.filter(m => m !== currentUser.id);
      if (others.length > 0) {
        g.chatMessages.push({ author: others[Math.floor(Math.random() * others.length)], text: ['ㅋㅋ 좋아요!','넵!','저도요~','오 그거 좋네요','언제 만나요?','좋은 생각이에요!','동의합니다~'][Math.floor(Math.random() * 7)], date: new Date() });
        if (currentChatType === 'group' && currentChatId === g.id) renderGroupMsgs(g);
      }
    }, 1500 + Math.random() * 2000);
  } else if (currentChatType === 'dm') {
    const fid = currentChatId;
    if (!dmChats[fid]) dmChats[fid] = [];
    dmChats[fid].push({ author: currentUser.id, text, date: new Date() });
    renderDmMsgs(fid);
    setTimeout(() => {
      dmChats[fid].push({ author: fid, text: ['안녕하세요!','ㅋㅋ','오 반가워요!','넵 좋아요!','그렇군요~','나중에 만나요!','좋은 하루 되세요!'][Math.floor(Math.random() * 7)], date: new Date() });
      if (currentChatType === 'dm' && currentChatId === fid) renderDmMsgs(fid);
    }, 1500 + Math.random() * 2000);
  }
}

document.getElementById('chatSendBtn').addEventListener('click', sendChat);
document.getElementById('chatInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });
document.getElementById('chatBackBtn').addEventListener('click', () => { currentChatType = null; currentChatId = null; renderChatRooms(); });
