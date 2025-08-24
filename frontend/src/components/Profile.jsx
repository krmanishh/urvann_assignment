import { useSelector } from "react-redux";
import { User, Mail, UserCheck, Shield, Edit } from "lucide-react";

const Profile = () => {
  const { user, role } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="bg-muted/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Profile not found
        </h2>
        <p className="text-muted-foreground">Please try logging in again</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="bg-card p-8 rounded-2xl shadow-xl border border-border">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-card-foreground mb-2">
            Your Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your FloraDeal account information
          </p>
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          <div className="bg-muted/30 p-6 rounded-xl border border-border">
            <div className="flex items-center space-x-3 mb-3">
              <UserCheck className="w-5 h-5 text-primary" />
              <label className="text-card-foreground text-sm font-semibold">
                Full Name
              </label>
            </div>
            <p className="text-card-foreground text-lg font-medium">
              {user.fullName}
            </p>
          </div>

          <div className="bg-muted/30 p-6 rounded-xl border border-border">
            <div className="flex items-center space-x-3 mb-3">
              <User className="w-5 h-5 text-primary" />
              <label className="text-card-foreground text-sm font-semibold">
                Username
              </label>
            </div>
            <p className="text-card-foreground text-lg font-medium">
              @{user.username}
            </p>
          </div>

          <div className="bg-muted/30 p-6 rounded-xl border border-border">
            <div className="flex items-center space-x-3 mb-3">
              <Mail className="w-5 h-5 text-primary" />
              <label className="text-card-foreground text-sm font-semibold">
                Email Address
              </label>
            </div>
            <p className="text-card-foreground text-lg font-medium">
              {user.email}
            </p>
          </div>

          <div className="bg-muted/30 p-6 rounded-xl border border-border">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-5 h-5 text-primary" />
              <label className="text-card-foreground text-sm font-semibold">
                Account Type
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === "admin"
                    ? "bg-secondary/20 text-secondary"
                    : "bg-primary/20 text-primary"
                }`}
              >
                {user.role === "admin"
                  ? "Admin"
                  : "User"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-secondary transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Edit className="w-5 h-5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
