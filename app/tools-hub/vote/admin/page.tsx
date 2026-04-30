'use client';
import React, { useState, useEffect } from 'react';
import { ref, set, onValue, push, remove, update } from 'firebase/database';
// 🌟 修正路徑：4個 ../ 退回根目錄找到 lib
import { rtdb as db } from '../../../../lib/firebase'; 

// 定義隊伍的資料結構
interface Team {
  id: string;
  name: string;
  icon: string;
  color: string;
  shadow: string;
  text: string;
  glow: string;
}

// 預設可供選擇的樣式池 (讓新增隊伍時能自動套用好看的發光顏色)
const STYLE_POOL = [
  { icon: '🌊', color: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500', text: 'text-cyan-400', glow: 'shadow-blue-500/50' },
  { icon: '🗡️', color: 'from-red-500 to-orange-400', shadow: 'shadow-orange-500', text: 'text-orange-400', glow: 'shadow-orange-500/50' },
  { icon: '🥖', color: 'from-green-500 to-emerald-400', shadow: 'shadow-emerald-500', text: 'text-emerald-400', glow: 'shadow-emerald-500/50' },
  { icon: '🕊️', color: 'from-purple-500 to-fuchsia-400', shadow: 'shadow-purple-500', text: 'text-fuchsia-400', glow: 'shadow-purple-500/50' },
  { icon: '👑', color: 'from-yellow-500 to-amber-400', shadow: 'shadow-yellow-500', text: 'text-amber-400', glow: 'shadow-yellow-500/50' },
];

export default function AdminPanel() {
  const [stage, setStage] = useState<'waiting' | 'voting' | 'reveal'>('waiting');
  const [totalVotes, setTotalVotes] = useState(0);
  
  // 用來儲存從資料庫讀取的隊伍資料
  const [teams, setTeams] = useState<Team[]>([]);
  // 用於編輯模式
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // 監聽目前資料庫的狀態與隊伍設定
  useEffect(() => {
    if (!db) return;

    // 監聽系統狀態
    const stageRef = ref(db, 'voteState/stage');
    const unsubscribeStage = onValue(stageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setStage(data);
    });

    const totalRef = ref(db, 'voteState/totalVotes');
    const unsubscribeTotal = onValue(totalRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) setTotalVotes(data);
    });

    // 監聽隊伍資料
    const teamsListRef = ref(db, 'teamsList');
    const unsubscribeTeams = onValue(teamsListRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // 將物件轉為陣列方便渲染
        const teamsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setTeams(teamsArray);
      } else {
        setTeams([]); // 如果沒資料就清空
      }
    });

    return () => {
      unsubscribeStage();
      unsubscribeTotal();
      unsubscribeTeams();
    };
  }, []);

  const updateStage = (newStage: 'waiting' | 'voting' | 'reveal') => {
    set(ref(db, 'voteState/stage'), newStage);
  };

  // 隊伍管理功能：新增隊伍
  const handleAddTeam = () => {
    const newTeamRef = push(ref(db, 'teamsList')); // Firebase 會自動產生唯一 ID
    const styleIndex = teams.length % STYLE_POOL.length; // 自動循環選取樣式
    const newTeamStyle = STYLE_POOL[styleIndex];

    const newTeamData = {
      name: `新增參賽隊伍 ${teams.length + 1}`,
      ...newTeamStyle
    };

    set(newTeamRef, newTeamData);
    
    // 同時在票數庫裡預先建立這個隊伍的欄位
    if (newTeamRef.key) {
      set(ref(db, `teamVotes/${newTeamRef.key}`), 0);
    }
  };

  // 隊伍管理功能：刪除隊伍
  const handleDeleteTeam = (teamId: string) => {
    if (confirm('確定要刪除這個隊伍嗎？相關票數也會一併移除。')) {
      remove(ref(db, `teamsList/${teamId}`));
      remove(ref(db, `teamVotes/${teamId}`));
    }
  };

  // 隊伍管理功能：儲存修改的名字
  const handleSaveName = (teamId: string) => {
    update(ref(db, `teamsList/${teamId}`), {
      name: editName
    });
    setEditingTeamId(null);
  };

  // 核心功能：歸零所有票數與狀態
  const resetAll = () => {
    if (confirm('確定要歸零所有票數嗎？(隊伍名稱不會被刪除)')) {
      set(ref(db, 'voteState'), {
        stage: 'waiting',
        totalVotes: 0,
      });
      
      // 只將現有隊伍的票數歸零，而不是刪除隊伍
      const resetVotes: Record<string, number> = {};
      teams.forEach(team => {
        resetVotes[team.id] = 0;
      });
      set(ref(db, 'teamVotes'), resetVotes);

      // 如果連隊伍都還沒有，就塞入預設的三隊
      if (teams.length === 0) {
        const defaultTeams = [
          { name: '摩西過紅海', ...STYLE_POOL[0] },
          { name: '大衛擊敗歌利亞', ...STYLE_POOL[1] },
          { name: '五餅二魚', ...STYLE_POOL[2] },
        ];
        const newTeamsList: any = {};
        const newTeamVotes: any = {};
        
        defaultTeams.forEach((t, i) => {
           const newId = `default_team_${i+1}`;
           newTeamsList[newId] = t;
           newTeamVotes[newId] = 0;
        });
        
        set(ref(db, 'teamsList'), newTeamsList);
        set(ref(db, 'teamVotes'), newTeamVotes);
      }

      alert('票數已重置就緒！');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 h-[90vh] flex flex-col">
        
        <div className="bg-indigo-600 p-6 text-white text-center shrink-0">
          <h1 className="text-2xl font-black tracking-widest">最高控制台</h1>
          <p className="text-indigo-200 text-sm mt-1 font-medium tracking-widest">CYBER ARK - 主持人專用</p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
          
          <div className="text-center p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
            <p className="text-slate-500 text-xs font-bold mb-1">全場系統狀態</p>
            <div className="text-xl font-black text-indigo-600 uppercase tracking-widest mb-1">
              {stage === 'waiting' && '等待掃碼中 ⏳'}
              {stage === 'voting' && '盲投進行中 🗳️'}
              {stage === 'reveal' && '開票展示中 👑'}
            </div>
            <p className="text-slate-500 font-medium text-sm">總票數：<span className="text-red-500 font-bold text-lg ml-1">{totalVotes}</span></p>
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={() => updateStage('waiting')} className={`py-3 rounded-lg font-bold tracking-wider transition-all ${stage === 'waiting' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-600'}`}>
              1. 顯示 QR Code
            </button>
            <button onClick={() => updateStage('voting')} className={`py-3 rounded-lg font-bold tracking-wider transition-all ${stage === 'voting' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-200 text-slate-600'}`}>
              2. 開放手機投票
            </button>
            <button onClick={() => updateStage('reveal')} className={`py-3 rounded-lg font-bold tracking-wider transition-all ${stage === 'reveal' ? 'bg-red-500 text-white shadow-md' : 'bg-slate-200 text-slate-600'}`}>
              3. 停止投票並開票
            </button>
          </div>

          <hr className="border-slate-200" />
          
          {/* 隊伍管理區塊 */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-black text-slate-700 tracking-wider">參賽隊伍設定</h3>
              <button onClick={handleAddTeam} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200 font-bold">
                + 新增隊伍
              </button>
            </div>
            
            <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {teams.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">目前沒有任何隊伍，請點擊新增或歸零重置。</p>
              ) : (
                teams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm border border-slate-100">
                    
                    {editingTeamId === team.id ? (
                      <div className="flex-1 flex gap-2 mr-2">
                        <input 
                          type="text" 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 border rounded px-2 py-1 text-sm outline-none focus:border-indigo-500 text-slate-700"
                          autoFocus
                        />
                        <button onClick={() => handleSaveName(team.id)} className="bg-green-500 text-white px-2 py-1 rounded text-xs">儲存</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-1 overflow-hidden mr-2">
                        <span className="text-xl">{team.icon}</span>
                        <span className="font-bold text-slate-700 truncate">{team.name}</span>
                        <button 
                          onClick={() => { setEditingTeamId(team.id); setEditName(team.name); }}
                          className="text-slate-400 hover:text-indigo-600 text-xs ml-2"
                        >
                          ✎ 修改
                        </button>
                      </div>
                    )}

                    <button onClick={() => handleDeleteTeam(team.id)} className="text-red-400 hover:text-red-600 text-xl leading-none px-2">×</button>
                  </div>
                ))
              )}
            </div>
          </div>

          <button onClick={resetAll} className="py-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl font-bold tracking-wide transition-all text-sm flex items-center justify-center gap-2 mt-auto">
            <span>⚠️</span> 歸零所有票數 (Reset)
          </button>

        </div>
      </div>
    </div>
  );
}