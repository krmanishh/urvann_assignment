import { useSelector } from 'react-redux';

const Profile = () => {
  const { user, role } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Full Name
          </label>
          <p className="text-gray-800">{user.fullName}</p>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <p className="text-gray-800">{user.username}</p>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <p className="text-gray-800">{user.email}</p>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Role
          </label>
          <p className="text-gray-800 capitalize">{user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
