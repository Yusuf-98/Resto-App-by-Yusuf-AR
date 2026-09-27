// --- Loading Skeleton (Home) ---
export default function HomeLoading() {
  return (
    <div className='mb-13'>
      {/* --- Hero Skeleton --- */}
      <div
        className='w-full animate-pulse bg-neutral-200'
        style={{
          height:
            'clamp(648px, 648px + (827px - 648px) * ((100vw - 393px) / (1440px - 393px)), 827px)',
        }}
      />

      {/* --- Categories Skeleton --- */}
      <div className='mx-auto w-full max-w-360 px-4 py-6 md:px-30 md:py-12'>
        <div className='grid grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-5 md:gap-x-5'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='flex flex-col gap-1 md:gap-2 items-center justify-center'
            >
              <div className='w-full h-25 animate-pulse rounded-2xl bg-neutral-200' />
              <div className='w-full h-7 md:h-8 flex items-center justify-center'>
                <div className='h-4 w-20 animate-pulse rounded bg-neutral-200' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
