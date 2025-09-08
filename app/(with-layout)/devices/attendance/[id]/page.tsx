import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Mail, School, User } from 'lucide-react';

const Page = () => {
  return (
    <div>
      <Card className="my-4">
        <CardContent>
          <h1 className="text-2xl font-bold">
            <User className="mr-2 inline-block h-6 w-6" />
            Prof. John Doe
          </h1>
          <div className="mt-4 flex flex-col space-y-2">
            <p className="text-muted-foreground mt-2">
              <School className="mr-2 inline-block h-4 w-4" />
              Computer Science Department
            </p>
            <p className="text-muted-foreground mt-2">
              <Mail className="mr-2 inline-block h-4 w-4" />
              John@gmail.com
            </p>
            <p>
              <Calendar className="mr-2 inline-block h-4 w-4" />
              Last Update: Sep 7, 09:45 PM
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
