
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Edit2, Save, User, Mail, Calendar, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "January 2024",
    profileImage: ""
  });

  const [editData, setEditData] = useState(profileData);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setEditData(prev => ({ ...prev, profileImage: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    { label: "Active Habits", value: "8", icon: Award },
    { label: "Total Completions", value: "156", icon: Calendar },
    { label: "Best Streak", value: "23 days", icon: Award },
    { label: "Success Rate", value: "78%", icon: Award },
  ];

  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
      </div>

      {/* Profile Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                  setEditData(profileData);
                }
              }}
            >
              {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={editData.profileImage} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-2xl">
                  {editData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                  <Camera size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={16} className="text-gray-400" />
                  <span>{profileData.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-700">
                  <Mail size={16} className="text-gray-400" />
                  <span>{profileData.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Member Since</Label>
              <div className="flex items-center space-x-2 text-gray-700">
                <Calendar size={16} className="text-gray-400" />
                <span>{profileData.joinDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-3 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Card */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                🏆
              </div>
              <div className="flex-1">
                <p className="font-medium">First Week Complete</p>
                <p className="text-sm text-gray-600">Completed habits for 7 days straight</p>
              </div>
              <Badge variant="secondary">Earned</Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                🌟
              </div>
              <div className="flex-1">
                <p className="font-medium">Consistency Master</p>
                <p className="text-sm text-gray-600">Maintained a 20-day streak</p>
              </div>
              <Badge variant="secondary">Earned</Badge>
            </div>

            <div className="flex items-center space-x-3 opacity-50">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                🚀
              </div>
              <div className="flex-1">
                <p className="font-medium">Habit Champion</p>
                <p className="text-sm text-gray-600">Complete 100 habits total</p>
              </div>
              <Badge variant="outline">Locked</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
