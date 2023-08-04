declare module 'feather-icons-react' {
  interface IFeatherIconProps {
    icon: string;
    strokeWidth: string | number;
    size?: string | number;
  }

  const FeatherIcon: React.FC<IFeatherIconProps>;

  export default FeatherIcon;
}
