
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { useAuth } from '../App';
import { Post, User, Comment } from '../types';
import { 
  Heart, MessageSquare, Share2, MoreHorizontal, Image as ImageIcon, 
  Video, Send, Bold, Italic, List, ShieldCheck, 
  Users, Globe, Sparkles, X, CheckCircle, Eye, EyeOff, Loader2,
  TrendingUp, UserPlus, Star, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Feed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'all' | 'connections'>('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [favorites, setFavorites] = useState<User[]>([]);
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
  const [activeCommentContent, setActiveCommentContent] = useState<Record<string, string>>({});
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadPosts();
    const allUsers = db.getUsers().filter(u => u.id !== user?.id).slice(0, 4);
    setFavorites(allUsers);
  }, [filter, user]);

  const loadPosts = () => {
    let allPosts = db.getPosts();
    if (filter === 'connections' && user) {
      // Demo logic for connections
      const connections = ['1', 'mentor_1', 'user_4', 'user_5'];
      allPosts = allPosts.filter(p => connections.includes(p.userId) || p.userId === user.id);
    }
    setPosts(allPosts);
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    const newText = beforeText + before + selected + after + afterText;
    setNewPostContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPostContent.trim()) return;

    setIsPosting(true);
    setTimeout(() => {
      const media = mediaUrl ? [{ type: mediaType, url: mediaUrl }] : undefined;
      db.addPost({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        userRole: user.role,
        content: newPostContent,
        media
      });
      
      setNewPostContent('');
      setMediaUrl('');
      setShowMediaInput(false);
      setIsPosting(false);
      setIsPreview(false);
      setShowToast(true);
      loadPosts();

      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  const handleLike = (postId: string) => {
    if (!user) return;
    db.likePost(postId, user.id);
    loadPosts();
  };

  const handleCommentSubmit = (postId: string) => {
    if (!user || !activeCommentContent[postId]?.trim()) return;

    db.addComment(postId, {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: activeCommentContent[postId]
    });

    setActiveCommentContent(prev => ({ ...prev, [postId]: '' }));
    loadPosts();
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      .split('\n').map((line, i) => <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: line }} />);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
      {showToast && (
        <div className="fixed top-24 right-8 z-[110] animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 backdrop-blur-xl">
            <CheckCircle className="text-emerald-500" size={18} />
            <p className="font-medium text-sm">Post published successfully!</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Profile & Favorites */}
        <aside className="lg:col-span-3 space-y-8 sticky top-28">
          {user ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="h-20 gradient-bg w-full"></div>
              <div className="px-6 pb-8 -mt-10 flex flex-col items-center text-center">
                <img src={user.avatar} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md mb-4" />
                <Link to={`/profile/${user.id}`} className="hover:text-blue-600 transition-colors">
                  <h3 className="font-black text-slate-900 text-lg tracking-tight">{user.name}</h3>
                </Link>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 mb-6">
                  {user.role} • {user.department}
                </p>
                
                <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                  <div className="text-center">
                    <div className="text-lg font-black text-slate-900">128</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-slate-900">
                      {posts.filter(p => p.userId === user.id).length}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posts</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
              <Sparkles className="text-blue-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Join the Feed</h3>
              <p className="text-sm text-slate-400 mb-6 font-medium">Log in to interact with the RUET community.</p>
              <Link to="/auth" className="block w-full py-3 bg-blue-600 text-center rounded-xl font-black text-sm hover:bg-blue-700 transition-all">Sign In</Link>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em] mb-6 flex items-center gap-2">
              <Star size={14} className="text-amber-400" /> Favorite Connections
            </h4>
            <div className="space-y-5">
              {favorites.map((fav) => (
                <Link key={fav.id} to={`/profile/${fav.id}`} className="flex items-center gap-3 group">
                  <img src={fav.avatar} className="w-10 h-10 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all border border-slate-100 shadow-sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">{fav.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest">{fav.position || fav.role}</p>
                  </div>
                </Link>
              ))}
              <button className="w-full py-3 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                View All Network
              </button>
            </div>
          </div>
        </aside>

        {/* MIDDLE COLUMN: Main Feed */}
        <main className="lg:col-span-6 space-y-8">
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
              <button 
                onClick={() => setFilter('all')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-black transition-all ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Globe size={14} /> Global
              </button>
              <button 
                onClick={() => setFilter('connections')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-black transition-all ${filter === 'connections' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Users size={14} /> Network
              </button>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Showing <span className="text-slate-900">{posts.length}</span> Posts
            </p>
          </div>

          {user && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <img src={user.avatar} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-50" />
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em] flex items-center gap-2">
                  <Send size={14} className="text-blue-600" /> What's on your mind?
                </h4>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  {isPreview ? (
                    <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 min-h-[140px] text-xs text-slate-600 overflow-y-auto max-h-[300px]">
                      {formatContent(newPostContent || "Type to preview...")}
                    </div>
                  ) : (
                    <textarea 
                      ref={textareaRef}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100 min-h-[140px] resize-none transition-all"
                      placeholder="Share a thought, project update, or career milestone..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                  )}
                </div>

                {showMediaInput && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 animate-in slide-in-from-top-1">
                    <input 
                      type="text" 
                      placeholder="Paste Media URL (e.g. Unsplash or YouTube link)..."
                      className="w-full bg-white border border-slate-100 rounded-lg px-3 py-2 text-xs outline-none mb-2"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setMediaType('image')} className={`px-2 py-1 rounded text-[8px] font-bold ${mediaType === 'image' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>IMAGE</button>
                      <button onClick={() => setMediaType('video')} className={`px-2 py-1 rounded text-[8px] font-bold ${mediaType === 'video' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>VIDEO</button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 border-t border-slate-50 pt-4">
                  <div className="flex gap-1">
                    <button onClick={() => insertText('**', '**')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Bold"><Bold size={16} /></button>
                    <button onClick={() => insertText('*', '*')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Italic"><Italic size={16} /></button>
                    <button onClick={() => insertText('- ')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="List"><List size={16} /></button>
                    <button onClick={() => setShowMediaInput(!showMediaInput)} className={`p-2 transition-colors ${mediaUrl ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`} title="Media"><ImageIcon size={16} /></button>
                    <button onClick={() => setIsPreview(!isPreview)} className={`p-2 transition-colors ${isPreview ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`} title="Preview">{isPreview ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  <button 
                    onClick={handlePostSubmit}
                    disabled={!newPostContent.trim() || isPosting}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
                  >
                    {isPosting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Post</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {posts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                <Sparkles className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-400 font-bold italic">No posts found in this feed yet.</p>
              </div>
            ) : (
              posts.map((post) => {
                const isLiked = user && post.likedBy.includes(user.id);
                const isCommentsOpen = openCommentPostId === post.id;
                
                return (
                  <div key={post.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-8 pb-4">
                      <div className="flex items-center justify-between mb-6">
                        <Link to={`/profile/${post.userId}`} className="flex items-center gap-4 group">
                          <img src={post.userAvatar} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-50" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{post.userName}</h4>
                              {post.userRole === 'Alumni' || post.userRole === 'Mentor' ? <ShieldCheck size={14} className="text-blue-500" /> : null}
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.userRole} • {new Date(post.timestamp).toLocaleDateString()}</p>
                          </div>
                        </Link>
                        <button className="text-slate-300 hover:text-slate-500 transition-colors">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>

                      <div className="text-slate-600 font-medium leading-relaxed mb-6 whitespace-pre-wrap">
                        {formatContent(post.content)}
                      </div>

                      {post.media && post.media.length > 0 && (
                        <div className="rounded-[1.5rem] overflow-hidden mb-6 border border-slate-50 bg-slate-50">
                          {post.media[0].type === 'video' ? (
                            <div className="aspect-video flex items-center justify-center bg-slate-900 text-white text-xs font-bold uppercase tracking-widest gap-2">
                              <Video size={24} className="text-blue-400" />
                              Video Player Placeholder
                            </div>
                          ) : (
                            <img src={post.media[0].url} className="w-full max-h-[500px] object-cover hover:scale-105 transition-transform duration-700" />
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 font-bold text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                        >
                          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} /> {post.likes}
                        </button>
                        <button 
                          onClick={() => setOpenCommentPostId(isCommentsOpen ? null : post.id)}
                          className={`flex items-center gap-2 font-bold text-sm transition-colors ${isCommentsOpen ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
                        >
                          <MessageSquare size={18} fill={isCommentsOpen ? 'rgba(37,99,235,0.1)' : 'none'} /> {post.comments.length}
                        </button>
                        <button className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors font-bold text-sm ml-auto">
                          <Share2 size={18} /> Share
                        </button>
                      </div>
                    </div>

                    {/* Comment Section */}
                    {isCommentsOpen && (
                      <div className="px-8 pb-8 pt-4 bg-slate-50/50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-4 mb-6">
                          {post.comments.length === 0 ? (
                            <p className="text-xs text-slate-400 italic text-center py-4">Be the first to comment!</p>
                          ) : (
                            post.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <img src={comment.userAvatar} className="w-8 h-8 rounded-lg object-cover" />
                                <div className="flex-grow">
                                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-black text-slate-900">{comment.userName}</span>
                                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                                        <Clock size={10} /> {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{comment.content}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {user && (
                          <div className="flex gap-3 items-center">
                            <img src={user.avatar} className="w-8 h-8 rounded-lg object-cover" />
                            <div className="flex-grow relative">
                              <input 
                                type="text" 
                                placeholder="Add a comment..."
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-100 pr-10"
                                value={activeCommentContent[post.id] || ''}
                                onChange={(e) => setActiveCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => { if(e.key === 'Enter') handleCommentSubmit(post.id); }}
                              />
                              <button 
                                onClick={() => handleCommentSubmit(post.id)}
                                disabled={!activeCommentContent[post.id]?.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 disabled:text-slate-300 hover:scale-110 transition-transform"
                              >
                                <Send size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>

        {/* RIGHT COLUMN: Trending */}
        <aside className="lg:col-span-3 space-y-8 sticky top-28">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em] mb-6 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-500" /> Trending Tags
            </h4>
            <div className="space-y-4">
              {[
                { tag: '#RUETConvocation', posts: '1.2k' },
                { tag: '#DhakaTechHub', posts: '850' },
                { tag: '#EngineeringExcellence', posts: '420' },
                { tag: '#SiliconValleyAlumni', posts: '310' },
                { tag: '#SpaceXProject', posts: '150' },
              ].map((item) => (
                <div key={item.tag} className="flex flex-col">
                  <Link to="/feed" className="text-sm font-black text-slate-800 hover:text-blue-600 transition-colors">
                    {item.tag}
                  </Link>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.posts} Posts</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-100">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <UserPlus size={80} />
            </div>
            <h4 className="text-lg font-black mb-3 leading-tight relative z-10">New Alumni in Town?</h4>
            <p className="text-[11px] font-bold text-blue-100 mb-6 leading-relaxed relative z-10">Connect with the batch of '24 and help them navigate their careers.</p>
            <Link to="/network" className="inline-block px-6 py-3 bg-white text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-50 transition-all">
              Invite Peers
            </Link>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Feed;
