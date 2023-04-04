type Props = {
  topic: string;
};

function Badge(props: Props) {
  const { topic } = props;

  return (
    <div className="bg-primary-light dark:bg-primary-dark py-1 px-2 rounded-md">
      <p className="text-xs font-bold text-white">
        {topic?.toUpperCase() || "UNKNOWN"}
      </p>
    </div>
  );
}

export default Badge;
