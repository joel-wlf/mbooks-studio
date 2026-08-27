type PageHeaderProps = {
  title: string;
  subtitle: string;
};

function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className='flex flex-col gap-1 mt-6 mb-5 sm:mt-16'>
      <h1 className='text-2xl font-medium tracking-tight sm:text-4xl'>
        {title}
      </h1>
      <p className='text-muted-foreground text-sm'>{subtitle}</p>
    </div>
  );
}

export default PageHeader;
