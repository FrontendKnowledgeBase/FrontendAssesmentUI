import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { FileX, Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <MainLayout categories={[]}>
      <div className="text-center py-16 space-y-6">
        <div className="flex justify-center">
          <FileX className="h-24 w-24 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-xl text-muted-foreground">
            The article or category you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
        
        <p className="text-muted-foreground max-w-md mx-auto">
          This could be because the content has been moved, renamed, or removed from the repository.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Search className="mr-2 h-4 w-4" />
              Browse Categories
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

