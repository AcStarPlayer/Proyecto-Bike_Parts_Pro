export function cardOnly(title, description, size = "md") {
  const sizes = {
    xs: "12rem",
    sm: "18rem",
    md: "26rem",
    lg: "36rem",
    xl: "48rem",
    xxl: "60rem",
  };

  return `
    <div class="card card-custom shadow" style="width: ${sizes[size] || sizes.md};">
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${description}</p>
        </div>
    </div>
  `;
}
