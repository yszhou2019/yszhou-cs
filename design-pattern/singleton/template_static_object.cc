#include <cassert>

template <typename T>
class Singleton
{
public:
    static T &Instance();
    Singleton(const Singleton &) = delete;
    Singleton(Singleton &&) = delete;
    Singleton &operator=(const Singleton &) = delete;
    Singleton &operator=(Singleton &&) = delete;

private:
// 1. 私有构造函数，不允许使用者自己生成对象
    Singleton() = default;
    ~Singleton() = default;
};

// 2. 必须返回引用
template <typename T>
T &Singleton<T>::Instance()
{
    // 3. 静态局部变量
    static T instance;
    return instance;
}

class A
{
};

int main()
{
    auto &a = Singleton<A>::Instance();
    auto &b = Singleton<A>::Instance();
    assert(&a == &b);
}