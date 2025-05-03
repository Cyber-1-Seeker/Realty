import React, { useEffect, useState } from 'react';
import { secureFetch } from '@/utils/api';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    secureFetch('/api/accounts/me/')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await secureFetch('/api/accounts/logout/', { method: 'POST' });
    window.location.href = '/';
  };

  if (!user) return <p>Загрузка...</p>;

  return (
    <div>
      <h1>Профиль</h1>
      <p>Email: {user.email}</p>
      <p>Телефон: {user.phone_number}</p>
      <p>Имя: {user.first_name}</p>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default ProfilePage;