export async function generateStaticParams() {
  // 예: API나 DB에서 ID 목록을 가져옴
  const posts = [{ id: "1" }, { id: "2" }, { id: "3" }];

  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function MovieDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1>MovieDetail {id}</h1>
      <p>MovieDetail {id}</p>
      <p>MovieDetail {id}</p>
    </div>
  );
}
