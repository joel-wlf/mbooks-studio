type PageHeaderProps = {
  title: string;
  subtitle: string;
};

function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className='flex flex-col gap-1 mt-16 mb-5'>
      <h1 className='text-4xl font-medium tracking-tight'>{title}</h1>
      <p className='text-muted-foreground text-sm'>{subtitle}</p>
    </div>
  );
}

export default PageHeader;
