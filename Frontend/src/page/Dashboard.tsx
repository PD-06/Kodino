import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import './Dashboard.css';

interface User {
  id: string;
  nama_panjang: string;
  username: string;
  email?: string;
  dikoin: number;
  clothe_sekarang?: string;
  current_clothes?: {
    id: string;
    nama_set: string;
    deskripsi: string;
    gambar: string;
    harga: number;
  };
  progress?: {
    section: number;
    level: number;
  };
}

interface Module {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  required_level: number;
  series: string;
  is_unlocked: boolean;
  is_current: boolean;
  // Removed is_next property
}

interface ClothesSet {
  id: string;
  nama_set: string;
  deskripsi: string;
  gambar: string;
  harga: number;
  created_at: string;
}

interface UserClothesSet {
  id: string;
  clothes_set: ClothesSet;
  obtained_at: string;
  created_at: string;
}

interface Lencana {
  id: string;
  nama_lencana: string;
  deskripsi: string;
  gambar: string;
  created_at: string;
}

interface UserLencana {
  id: string;
  lencana: Lencana;
  created_at: string;
}

interface Artefak {
  id: string;
  nama_artefak: string;
  deskripsi: string;
  gambar: string;
  harga: number;
  region: string;
  created_at: string;
}

interface UserArtefak {
  id: string;
  artefak: Artefak;
  created_at: string;
}

interface AvailableModulesResponse {
  user_level: number;
  available_modules: Module[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [userClothes, setUserClothes] = useState<UserClothesSet[]>([]);
  const [allClothes, setAllClothes] = useState<ClothesSet[]>([]);
  const [userLencana, setUserLencana] = useState<UserLencana[]>([]);
  const [allLencana, setAllLencana] = useState<Lencana[]>([]);
  const [userArtefak, setUserArtefak] = useState<UserArtefak[]>([]);
  const [allArtefak, setAllArtefak] = useState<Artefak[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nama_panjang: '',
    username: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setEditFormData({
        nama_panjang: user.nama_panjang || '',
        username: user.username || '',
        email: user.email || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    }
  }, [user]);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('kodino_user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchAllData(parsedUser.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save profile changes
  const saveProfileChanges = async () => {
    if (!user) return;

    try {
      // Validate required fields
      if (!editFormData.nama_panjang.trim() || !editFormData.username.trim()) {
        alert('Nama dan username tidak boleh kosong!');
        return;
      }

      // Validate username format
      if (!/^[a-zA-Z0-9_]+$/.test(editFormData.username)) {
        alert('Username hanya boleh mengandung huruf, angka, dan underscore!');
        return;
      }

      // Validate email format if provided
      if (editFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
        alert('Format email tidak valid!');
        return;
      }

      const response = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama_panjang: editFormData.nama_panjang.trim(),
          username: editFormData.username.trim(),
          email: editFormData.email.trim() || null
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('kodino_user', JSON.stringify(updatedUser));
        setIsEditing(false);
        alert('Profil berhasil diperbarui! 🎉');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Terjadi kesalahan saat memperbarui profil');
    }
  };

  // Change password
  const changePassword = async () => {
    if (!user) return;

    try {
      // Validate password fields
      if (!editFormData.current_password || !editFormData.new_password || !editFormData.confirm_password) {
        alert('Semua field password harus diisi!');
        return;
      }

      if (editFormData.new_password !== editFormData.confirm_password) {
        alert('Password baru dan konfirmasi password tidak cocok!');
        return;
      }

      if (editFormData.new_password.length < 6) {
        alert('Password baru minimal 6 karakter!');
        return;
      }

      const response = await fetch(`http://localhost:8000/users/${user.id}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: editFormData.current_password,
          new_password: editFormData.new_password
        })
      });

      if (response.ok) {
        setIsChangingPassword(false);
        setEditFormData(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          confirm_password: ''
        }));
        alert('Password berhasil diubah! 🎉');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal mengubah password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Terjadi kesalahan saat mengubah password');
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    if (user) {
      setEditFormData({
        nama_panjang: user.nama_panjang || '',
        username: user.username || '',
        email: user.email || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    }
  };

  const fetchAllData = async (userId: string) => {
    try {
      // Fetch all data concurrently
      const [
        modulesRes,
        userClothesRes,
        allClothesRes,
        userLencanaRes,
        allLencanaRes,
        userArtefakRes,
        allArtefakRes
      ] = await Promise.all([
        fetch(`http://localhost:8000/users/${userId}/available-modules`),
        fetch(`http://localhost:8000/user-clothes-set/${userId}`),
        fetch(`http://localhost:8000/clothes-set`),
        fetch(`http://localhost:8000/user-lencana/${userId}`),
        fetch(`http://localhost:8000/lencana`),
        fetch(`http://localhost:8000/user-artefak/${userId}`),
        fetch(`http://localhost:8000/artefak`)
      ]);

      // Process responses
      if (modulesRes.ok) {
        const modulesData: AvailableModulesResponse = await modulesRes.json();
        setAvailableModules(modulesData.available_modules);
      }

      if (userClothesRes.ok) {
        const userClothesData: UserClothesSet[] = await userClothesRes.json();
        setUserClothes(userClothesData);
      }

      if (allClothesRes.ok) {
        const allClothesData: ClothesSet[] = await allClothesRes.json();
        setAllClothes(allClothesData);
      }

      if (userLencanaRes.ok) {
        const userLencanaData: UserLencana[] = await userLencanaRes.json();
        setUserLencana(userLencanaData);
      }

      if (allLencanaRes.ok) {
        const allLencanaData: Lencana[] = await allLencanaRes.json();
        setAllLencana(allLencanaData);
      }

      if (userArtefakRes.ok) {
        const userArtefakData: UserArtefak[] = await userArtefakRes.json();
        setUserArtefak(userArtefakData);
      }

      if (allArtefakRes.ok) {
        const allArtefakData: Artefak[] = await allArtefakRes.json();
        setAllArtefak(allArtefakData);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeClothes = async (clothesSetId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:8000/users/${user.id}/change-clothes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clothes_set_id: clothesSetId
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Update user data in localStorage and state
        const updatedUser = { ...user, clothe_sekarang: clothesSetId };
        
        // Find the new clothes set
        const newClothes = allClothes.find(c => c.id === clothesSetId);
        if (newClothes) {
          updatedUser.current_clothes = newClothes;
        }

        setUser(updatedUser);
        localStorage.setItem('kodino_user', JSON.stringify(updatedUser));
        
        alert('Kostum berhasil diubah!');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal mengubah kostum');
      }
    } catch (error) {
      console.error('Error changing clothes:', error);
      alert('Terjadi kesalahan saat mengubah kostum');
    }
  };

  const getProgressPercentage = (): number => {
    if (!user?.progress) return 0;
    return (user.progress.level / 6) * 100;
  };

  const getProgressText = (): string => {
    if (!user?.progress) return '0% dari seluruh Nusantara!';
    const percentage = Math.round(getProgressPercentage());
    return `${percentage}% dari seluruh Nusantara!`;
  };

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };

  const handleModuleClick = (moduleId: string, isUnlocked: boolean) => {
    if (isUnlocked) {
      navigate(`/materi/${moduleId}`);
    } else {
      alert('Modul ini belum terbuka. Selesaikan modul sebelumnya terlebih dahulu!');
    }
  };

  const getCurrentClothesDisplayName = (): string => {
    if (user?.current_clothes) {
      return user.current_clothes.nama_set;
    }
    return 'Kostum Default';
  };

  const buyClothes = async (clothesId: string, price: number) => {
    if (!user) return;

    if (user.dikoin < price) {
      alert('DiKoin tidak cukup untuk membeli kostum ini!');
      return;
    }

    try {
      // First, award the clothes to user
      const awardResponse = await fetch(`http://localhost:8000/user-clothes-set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          clothes_set_id: clothesId
        })
      });

      if (!awardResponse.ok) {
        const error = await awardResponse.json();
        alert(error.error || 'Gagal membeli kostum');
        return;
      }

      // Then, deduct DiKoin from user
      const updateResponse = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dikoin: user.dikoin - price
        })
      });

      if (updateResponse.ok) {
        // Update user state
        const updatedUser = { ...user, dikoin: user.dikoin - price };
        setUser(updatedUser);
        localStorage.setItem('kodino_user', JSON.stringify(updatedUser));
        
        // Refresh data
        fetchAllData(user.id);
        
        alert('Kostum berhasil dibeli! 🎉');
      } else {
        alert('Terjadi kesalahan saat memproses pembayaran');
      }
    } catch (error) {
      console.error('Error buying clothes:', error);
      alert('Terjadi kesalahan saat membeli kostum');
    }
  };

  const buyArtefak = async (artefakId: string, price: number) => {
    if (!user) return;

    if (user.dikoin < price) {
      alert('DiKoin tidak cukup untuk membeli artefak ini!');
      return;
    }

    try {
      // First, award the artefak to user
      const awardResponse = await fetch(`http://localhost:8000/user-artefak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          artefak_id: artefakId
        })
      });

      if (!awardResponse.ok) {
        const error = await awardResponse.json();
        alert(error.error || 'Gagal membeli artefak');
        return;
      }

      // Then, deduct DiKoin from user
      const updateResponse = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dikoin: user.dikoin - price
        })
      });

      if (updateResponse.ok) {
        // Update user state
        const updatedUser = { ...user, dikoin: user.dikoin - price };
        setUser(updatedUser);
        localStorage.setItem('kodino_user', JSON.stringify(updatedUser));
        
        // Refresh data
        fetchAllData(user.id);
        
        alert('Artefak berhasil dibeli! 🎉');
      } else {
        alert('Terjadi kesalahan saat memproses pembayaran');
      }
    } catch (error) {
      console.error('Error buying artefak:', error);
      alert('Terjadi kesalahan saat membeli artefak');
    }
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="welcome-section1">
              <div className="welcome-text">
                <h1 className="welcome-title">
                  Selamat Datang, {user?.nama_panjang || 'User'}!
                </h1>
                <p className="welcome-subtitle">
                  Kabar baik dari Nusantara! Kodi nungguin kamu ngoding bareng lagi nih~
                </p>
                
                <div className="progress-section">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    <span>🏝️</span>
                    <span>{getProgressText()}</span>
                  </div>
                </div>

                <div className="latest-module">
                  <h3>Modul yang Tersedia</h3>
                  <p className="module-subtitle">Lanjutkan Petualanganmu!</p>
                  
                  {isLoading ? (
                    <div className="loading-modules">
                      <p>Memuat modul...</p>
                    </div>
                  ) : availableModules.length > 0 ? (
                    availableModules.map((module) => (
                      <div 
                        key={module.id}
                        className={`module-card ${module.is_current ? 'current-module' : ''} ${!module.is_unlocked ? 'locked-module' : ''}`}
                        onClick={() => handleModuleClick(module.id, module.is_unlocked)}
                        style={{ cursor: module.is_unlocked ? 'pointer' : 'not-allowed' }}
                      >
                        <div className="module-icon">{module.icon}</div>
                        <div className="module-info">
                          <h4>{module.title}</h4>
                          <p>{module.subtitle}</p>
                          <span className="module-series">{module.series}</span>
                          {module.is_current && <span className="current-badge">📍 Sedang Belajar</span>}
                          {/* Removed next-badge span */}
                        </div>
                        <div className="module-status">
                          {module.is_unlocked ? '✅' : '🔒'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-modules">
                      <p>Tidak ada modul yang tersedia</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="kostum-section">
                <h2>Kostum Kodi</h2>
                <div className="kodi-character">
                  <img 
                    src={user?.current_clothes?.gambar || "/images/kodi-character.webp"} 
                    alt="Kodi" 
                  />
                </div>
                <div className="costume-details">
                  <div className="costume-info">
                    <h4>Kostum Saat Ini:</h4>
                    <p><strong>{getCurrentClothesDisplayName()}</strong></p>
                    {user?.current_clothes?.deskripsi && (
                      <p className="costume-description">
                        {user.current_clothes.deskripsi}
                      </p>
                    )}
                  </div>
                  <button 
                    className="change-costume-btn"
                    onClick={() => handleSectionClick('kostum-kodi')}
                  >
                    Ganti Kostum
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'kostum-kodi':
        return (
          <div className="kostum-content">
            <div className="kodi-display">
              <img 
                src={user?.current_clothes?.gambar || "/images/kodi-character.webp"} 
                alt="Kodi" 
                className="large-kodi" 
              />
            </div>
            <div className="clothes-selector">
              <h2>Pilihan Pakaian Adat</h2>
              <div className="current-costume-info">
                <h3>Kostum Saat Ini: {getCurrentClothesDisplayName()}</h3>
                {user?.current_clothes?.deskripsi && (
                  <p>{user.current_clothes.deskripsi}</p>
                )}
              </div>
              <div className="clothes-grid">
                {isLoading ? (
                  <div className="loading-modules">
                    <p>Memuat kostum...</p>
                  </div>
                ) : userClothes.length > 0 ? (
                  userClothes.map((userCloth) => (
                    <div 
                      key={userCloth.id} 
                      className={`clothes-item ${user?.clothe_sekarang === userCloth.clothes_set.id ? 'active' : ''}`}
                      onClick={() => changeClothes(userCloth.clothes_set.id)}
                    >
                      <img 
                        src={userCloth.clothes_set.gambar || "/images/kodi-character.webp"} 
                        alt={userCloth.clothes_set.nama_set} 
                      />
                      <p>{userCloth.clothes_set.nama_set}</p>
                    </div>
                  ))
                ) : (
                  <div className="no-modules">
                    <p>Belum memiliki kostum. Selesaikan modul untuk mendapatkan kostum!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

        case 'toko-kostum':
            return (
              <div className="toko-content">
                <h2>Toko Kostum</h2>
                <div className="user-dikoin">
                  <h3>💰 DiKoin Anda: {user?.dikoin || 0} DC</h3>
                </div>
                <div className="items-grid">
                  {isLoading ? (
                    Array.from({ length: 8 }, (_, i) => (
                      <div key={i} className="item-card">
                        <div className="item-image">⏳</div>
                        <div className="item-info">
                          <h4>Memuat...</h4>
                          <div className="item-price">--- DC</div>
                        </div>
                      </div>
                    ))
                  ) : (() => {
                    // Filter out clothes that user already owns
                    const availableClothes = allClothes.filter(clothes => 
                      !userClothes.some(uc => uc.clothes_set.id === clothes.id)
                    );
                    
                    return availableClothes.length > 0 ? (
                      availableClothes.map((clothes) => (
                        <div key={clothes.id} className="item-card">
                          <div className="item-image">
                            {clothes.gambar ? (
                              <img src={clothes.gambar} alt={clothes.nama_set} />
                            ) : (
                              <span>👕</span>
                            )}
                          </div>
                          <div className="item-info">
                            <h4>{clothes.nama_set}</h4>
                            <p className="item-description">{clothes.deskripsi}</p>
                            <div className="item-actions">
                              {(user?.dikoin || 0) >= clothes.harga ? (
                                <button 
                                  className="item-buy-btn"
                                  onClick={() => buyClothes(clothes.id, clothes.harga)}
                                >
                                  Beli {clothes.harga} DC
                                </button>
                              ) : (
                                <div className="item-insufficient">
                                  💰 DiKoin tidak cukup ({clothes.harga} DC)
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-modules">
                        <p>Semua kostum sudah dimiliki! 🎉</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            );

      case 'lencana':
        return (
          <div className="lencana-content">
            <h2>Koleksi Lencana</h2>
            <div className="badges-grid">
              {isLoading ? (
                Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="badge-card empty">
                    <div className="badge-placeholder">⏳</div>
                    <p>Memuat...</p>
                  </div>
                ))
              ) : (
                <>
                  {userLencana.map((userBadge) => (
                    <div key={userBadge.id} className="badge-card earned">
                      <div className="badge-icon">
                        {userBadge.lencana.gambar ? (
                          <img src={userBadge.lencana.gambar} alt={userBadge.lencana.nama_lencana} />
                        ) : (
                          <div className="badge-placeholder">🏆</div>
                        )}
                      </div>
                      <h4>{userBadge.lencana.nama_lencana}</h4>
                      <p>{userBadge.lencana.deskripsi}</p>
                      <small>Diperoleh: {new Date(userBadge.created_at).toLocaleDateString('id-ID')}</small>
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 6 - userLencana.length) }, (_, i) => (
                    <div key={`empty-${i}`} className="badge-card empty">
                      <div className="badge-placeholder">🔒</div>
                      <p>Lencana Terkunci</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        );

        case 'toko-budaya':
            return (
              <div className="toko-content">
                <h2>Toko Budaya</h2>
                <div className="user-dikoin">
                  <h3>💰 DiKoin Anda: {user?.dikoin || 0} DC</h3>
                </div>
                <div className="items-grid">
                  {isLoading ? (
                    Array.from({ length: 8 }, (_, i) => (
                      <div key={i} className="item-card">
                        <div className="item-image">⏳</div>
                        <div className="item-info">
                          <h4>Memuat...</h4>
                          <div className="item-price">--- DC</div>
                        </div>
                      </div>
                    ))
                  ) : (() => {
                    // Filter out artifacts that user already owns
                    const availableArtefak = allArtefak.filter(artefak => 
                      !userArtefak.some(ua => ua.artefak.id === artefak.id)
                    );
                    
                    return availableArtefak.length > 0 ? (
                      availableArtefak.map((artefak) => (
                        <div key={artefak.id} className="item-card">
                          <div className="item-image">
                            {artefak.gambar ? (
                              <img src={artefak.gambar} alt={artefak.nama_artefak} />
                            ) : (
                              <span>🏺</span>
                            )}
                          </div>
                          <div className="item-info">
                            <h4>{artefak.nama_artefak}</h4>
                            <p className="item-region">{artefak.region}</p>
                            <p className="item-description">{artefak.deskripsi}</p>
                            <div className="item-actions">
                              {(user?.dikoin || 0) >= artefak.harga ? (
                                <button 
                                  className="item-buy-btn"
                                  onClick={() => buyArtefak(artefak.id, artefak.harga)}
                                >
                                  Beli {artefak.harga} DC
                                </button>
                              ) : (
                                <div className="item-insufficient">
                                  💰 DiKoin tidak cukup ({artefak.harga} DC)
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-modules">
                        <p>Semua artefak sudah dimiliki! 🎉</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            );

      case 'koleksi-budaya':
        return (
          <div className="koleksi-content">
            <h2>Koleksi Budaya</h2>
            <div className="collection-grid">
              {isLoading ? (
                Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="collection-card empty">
                    <div className="collection-placeholder">⏳</div>
                    <p>Memuat...</p>
                  </div>
                ))
              ) : (
                <>
                  {userArtefak.map((userArt) => (
                    <div key={userArt.id} className="collection-card filled">
                      <div className="collection-image">
                        {userArt.artefak.gambar ? (
                          <img src={userArt.artefak.gambar} alt={userArt.artefak.nama_artefak} />
                        ) : (
                          <span>🏺</span>
                        )}
                      </div>
                      <h4>{userArt.artefak.nama_artefak}</h4>
                      <p className="collection-region">{userArt.artefak.region}</p>
                      <small>Diperoleh: {new Date(userArt.created_at).toLocaleDateString('id-ID')}</small>
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 8 - userArtefak.length) }, (_, i) => (
                    <div key={`empty-${i}`} className="collection-card empty">
                      <div className="collection-placeholder">📦</div>
                      <p>Slot Kosong</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        );

        case 'pengaturan-akun':
            return (
              <div className="settings-content">
                <div className="settings-form">
                  <h2>Pengaturan Akun</h2>
                  
                  {/* Profile Information Section */}
                  <div className="settings-section">
                    <h3>Informasi Profil</h3>
                    
                    <div className="form-group">
                      <label>Nama Lengkap</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFormData.nama_panjang}
                          onChange={(e) => handleInputChange('nama_panjang', e.target.value)}
                          className="form-input"
                          placeholder="Masukkan nama lengkap"
                        />
                      ) : (
                        <div className="form-display">
                          <p>{user?.nama_panjang}</p>
                          <button 
                            className="edit-btn"
                            onClick={() => setIsEditing(true)}
                          >
                            ✏️ Edit
                          </button>
                        </div>
                      )}
                    </div>
        
                    <div className="form-group">
                      <label>Username</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFormData.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          className="form-input"
                          placeholder="Masukkan username"
                        />
                      ) : (
                        <div className="form-display">
                          <p>@{user?.username}</p>
                          {!isEditing && (
                            <button 
                              className="edit-btn"
                              onClick={() => setIsEditing(true)}
                            >
                              ✏️ Edit
                            </button>
                          )}
                        </div>
                      )}
                    </div>
        
                    <div className="form-group">
                      <label>Alamat Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="form-input"
                          placeholder="Masukkan alamat email (opsional)"
                        />
                      ) : (
                        <div className="form-display">
                          <p>{user?.email || 'Belum ada email'}</p>
                          {!isEditing && (
                            <button 
                              className="edit-btn"
                              onClick={() => setIsEditing(true)}
                            >
                              ✏️ Edit
                            </button>
                          )}
                        </div>
                      )}
                    </div>
        
                    {isEditing && (
                      <div className="form-actions">
                        <button 
                          className="save-btn"
                          onClick={saveProfileChanges}
                        >
                          💾 Simpan Perubahan
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={cancelEditing}
                        >
                          ❌ Batal
                        </button>
                      </div>
                    )}
                  </div>
        
                  {/* Account Statistics Section */}
                  <div className="settings-section">
                    <h3>Statistik Akun</h3>
                    
                    <div className="form-group">
                      <label>DiKoin</label>
                      <div className="stat-display">
                        <span className="stat-value">💰 {user?.dikoin || 0} DC</span>
                      </div>
                    </div>
        
                    <div className="form-group">
                      <label>Progress Belajar</label>
                      <div className="stat-display">
                        <span className="stat-value">🎯 Level {user?.progress?.level || 1} - Section {user?.progress?.section || 1}</span>
                        <div className="progress-mini-bar">
                          <div 
                            className="progress-mini-fill" 
                            style={{ width: `${getProgressPercentage()}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
        
                  {/* Password Section */}
                  <div className="settings-section">
                    <h3>Keamanan</h3>
                    
                    <div className="form-group">
                      <label>Password</label>
                      {isChangingPassword ? (
                        <div className="password-change-form">
                          <input
                            type="password"
                            value={editFormData.current_password}
                            onChange={(e) => handleInputChange('current_password', e.target.value)}
                            className="form-input"
                            placeholder="Password saat ini"
                          />
                          <input
                            type="password"
                            value={editFormData.new_password}
                            onChange={(e) => handleInputChange('new_password', e.target.value)}
                            className="form-input"
                            placeholder="Password baru"
                          />
                          <input
                            type="password"
                            value={editFormData.confirm_password}
                            onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                            className="form-input"
                            placeholder="Konfirmasi password baru"
                          />
                          <div className="form-actions">
                            <button 
                              className="save-btn"
                              onClick={changePassword}
                            >
                              🔒 Ubah Password
                            </button>
                            <button 
                              className="cancel-btn"
                              onClick={cancelEditing}
                            >
                              ❌ Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="form-display">
                          <p>************************</p>
                          <button 
                            className="edit-btn"
                            onClick={() => setIsChangingPassword(true)}
                          >
                            🔒 Ubah Password
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
        
                <div className="profile-photo">
                  <div className="photo-placeholder">
                    <span>👤</span>
                  </div>
                  <p><em>Foto Profil</em></p>
                  <button className="upload-photo-btn">
                    📷 Upload Foto
                  </button>
                  
                  <div className="stats-summary">
                    <h4>Koleksi</h4>
                    <div className="stat-item">
                      <span className="stat-icon">🏆</span>
                      <span className="stat-label">Lencana:</span>
                      <span className="stat-number">{userLencana.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">🏺</span>
                      <span className="stat-label">Artefak:</span>
                      <span className="stat-number">{userArtefak.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">👕</span>
                      <span className="stat-label">Kostum:</span>
                      <span className="stat-number">{userClothes.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="dashboard-page">
        <Header />
        <div className="dashboard-container">
          <div className="login-prompt">
            <h2>Silakan login terlebih dahulu</h2>
            <button onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Header />

      <div className="dashboard-container">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleSectionClick('dashboard')}
            >
              Dasbor
            </button>
            <button 
              className={`nav-item ${activeSection === 'kostum-kodi' ? 'active' : ''}`}
              onClick={() => handleSectionClick('kostum-kodi')}
            >
              Kostum Kodi
            </button>
            <button 
              className={`nav-item ${activeSection === 'toko-kostum' ? 'active' : ''}`}
              onClick={() => handleSectionClick('toko-kostum')}
            >
              Toko Kostum
            </button>
            <button 
              className={`nav-item ${activeSection === 'lencana' ? 'active' : ''}`}
              onClick={() => handleSectionClick('lencana')}
            >
              Lencana
            </button>
            <button 
              className={`nav-item ${activeSection === 'toko-budaya' ? 'active' : ''}`}
              onClick={() => handleSectionClick('toko-budaya')}
            >
              Toko Budaya
            </button>
            <button 
              className={`nav-item ${activeSection === 'koleksi-budaya' ? 'active' : ''}`}
              onClick={() => handleSectionClick('koleksi-budaya')}
            >
              Koleksi Budaya
            </button>
            <button 
              className={`nav-item ${activeSection === 'pengaturan-akun' ? 'active' : ''}`}
              onClick={() => handleSectionClick('pengaturan-akun')}
            >
              Pengaturan Akun
            </button>
          </nav>
        </aside>

        <main className="main-content">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;