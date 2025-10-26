import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { socketManager } from '@/lib/socket';
import { useGetUsersQuery } from '@/queries/users';

import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const ActiveUsers = ({ usersList }: { usersList: string[] }) => {
  const { data: users } = useGetUsersQuery();
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  useEffect(() => {
    const socket = socketManager.connect();

    if (!socket) return;

    socket.emit('active-users', {}, (payload: string[]) => {
      const filteredActiveUsers = payload.filter((userId) =>
        usersList.includes(userId)
      );
      console.log(payload);

      console.log(usersList);
      console.log(filteredActiveUsers);

      setActiveUsers(filteredActiveUsers);
    });

    socket.on('active-users', (payload: string[]) => {
      const filteredActiveUsers = payload.filter((userId) =>
        usersList.includes(userId)
      );
      setActiveUsers(filteredActiveUsers);
    });

    return () => {
      socket.off('active-users');
    };
  }, [usersList]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
        <Users className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {activeUsers.length || 0}/{users?.length || 0}
        </div>
        <Progress
          value={(activeUsers.length / (users?.length || 0)) * 100}
          className="mt-2"
        />
        <p className="text-muted-foreground mt-2 text-xs">
          <span className="flex items-center gap-1 text-blue-500">
            <Users className="h-3 w-3" /> {activeUsers.length} online
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default ActiveUsers;
