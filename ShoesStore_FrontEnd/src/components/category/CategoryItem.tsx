import { NavLink } from "react-router-dom";

type Props = {
  link: string | "#";
  urlImage?: string;
  title?: string;
};

const CategoryItem = ({ link, urlImage, title }: Props) => {
  return (
    <NavLink
      to={link}
      className="relative group aspect-4/5 overflow-hidden rounded-2xl bg-gray-100"
    >
      <img
        src={urlImage}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"></div>
      <div className="absolute bottom-8 left-8 text-white">
        <h3 className="text-3xl font-black mb-2 text-white dark:text-primary-foreground">
          {title}
        </h3>
        <span className="text-sm text-white dark:text-primary-foreground font-bold uppercase tracking-widest flex items-center gap-2">
          Shop Collection{" "}
          <span className="material-symbols-outlined text-sm">north_east</span>
        </span>
      </div>
    </NavLink>
  );
};

CategoryItem.propTypes = {};

export default CategoryItem;
